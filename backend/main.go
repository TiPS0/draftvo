package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// ── Data store ────────────────────────────────────────────────────────────────

const usersFile = "users.json"
const invitesFile = "invites.json"

type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`
	Role         string    `json:"role"` // "Admin" or "Member"
	CreatedAt    time.Time `json:"created_at"`
}

type Invite struct {
	ID        string    `json:"id"`
	Token     string    `json:"token"`
	CreatedBy string    `json:"created_by"`
	Used      bool      `json:"used"`
	CreatedAt time.Time `json:"created_at"`
}

var (
	mu      sync.RWMutex
	users   []User
	invites []Invite
)

func loadData() error {
	// Load users
	data, err := os.ReadFile(usersFile)
	if err != nil && !os.IsNotExist(err) {
		return err
	}
	if !os.IsNotExist(err) {
		if err := json.Unmarshal(data, &users); err != nil {
			return err
		}
	} else {
		users = []User{}
	}

	// Load invites
	dataInvites, errInvites := os.ReadFile(invitesFile)
	if errInvites != nil && !os.IsNotExist(errInvites) {
		return errInvites
	}
	if !os.IsNotExist(errInvites) {
		if err := json.Unmarshal(dataInvites, &invites); err != nil {
			return err
		}
	} else {
		invites = []Invite{}
	}
	return nil
}

func saveUsers() error {
	data, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(usersFile, data, 0600)
}

func saveInvites() error {
	data, err := json.MarshalIndent(invites, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(invitesFile, data, 0600)
}

func findUserByEmail(email string) *User {
	for i := range users {
		if users[i].Email == email {
			return &users[i]
		}
	}
	return nil
}

func findUserByID(id string) *User {
	for i := range users {
		if users[i].ID == id {
			return &users[i]
		}
	}
	return nil
}

// ── Auth & Session ────────────────────────────────────────────────────────────

var jwtSecret = []byte(getEnvOrDefault("JWT_SECRET", "super-secret-key-change-in-production"))

func getEnvOrDefault(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}

func generateJWT(user User) (string, error) {
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"role":  user.Role,
		"email": user.Email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ── Handlers ──────────────────────────────────────────────────────────────────

type RegisterRequest struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	InviteToken string `json:"inviteToken"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type AuthUserResponse struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "http://localhost:3000"
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			writeJSON(w, http.StatusUnauthorized, ErrorResponse{Error: "unauthorized"})
			return
		}

		tokenString := cookie.Value
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			writeJSON(w, http.StatusUnauthorized, ErrorResponse{Error: "unauthorized"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			writeJSON(w, http.StatusUnauthorized, ErrorResponse{Error: "unauthorized"})
			return
		}

		userID := claims["sub"].(string)
		
		mu.RLock()
		user := findUserByID(userID)
		mu.RUnlock()

		if user == nil {
			writeJSON(w, http.StatusUnauthorized, ErrorResponse{Error: "unauthorized"})
			return
		}

		// Store user id in context (simplification: we'll just set headers for the next handler)
		r.Header.Set("X-User-ID", user.ID)
		r.Header.Set("X-User-Role", user.Role)

		next(w, r)
	}
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, ErrorResponse{Error: "method not allowed"})
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: "invalid request body"})
		return
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: "name, email, and password are required"})
		return
	}

	if len(req.Password) < 8 {
		writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: "password must be at least 8 characters"})
		return
	}

	mu.Lock()
	defer mu.Unlock()

	if findUserByEmail(req.Email) != nil {
		writeJSON(w, http.StatusConflict, ErrorResponse{Error: "an account with this email already exists"})
		return
	}

	role := "Member"
	
	// First-user Admin logic & Invite logic
	if len(users) == 0 {
		role = "Admin"
	} else {
		if req.InviteToken == "" {
			writeJSON(w, http.StatusForbidden, ErrorResponse{Error: "an invite token is required to register"})
			return
		}
		
		validInvite := false
		for i, inv := range invites {
			if inv.Token == req.InviteToken && !inv.Used {
				validInvite = true
				invites[i].Used = true // Mark as used
				break
			}
		}
		
		if !validInvite {
			writeJSON(w, http.StatusForbidden, ErrorResponse{Error: "invalid or expired invite token"})
			return
		}
		
		if err := saveInvites(); err != nil {
			log.Printf("failed to save invites: %v", err)
			writeJSON(w, http.StatusInternalServerError, ErrorResponse{Error: "internal server error"})
			return
		}
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, ErrorResponse{Error: "internal server error"})
		return
	}

	user := User{
		ID:           fmt.Sprintf("%d", time.Now().UnixNano()),
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hash),
		Role:         role,
		CreatedAt:    time.Now(),
	}
	users = append(users, user)

	if err := saveUsers(); err != nil {
		log.Printf("failed to save users: %v", err)
		writeJSON(w, http.StatusInternalServerError, ErrorResponse{Error: "internal server error"})
		return
	}

	writeJSON(w, http.StatusCreated, map[string]bool{"ok": true})
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, ErrorResponse{Error: "method not allowed"})
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: "invalid request body"})
		return
	}

	mu.RLock()
	user := findUserByEmail(req.Email)
	mu.RUnlock()

	if user == nil {
		writeJSON(w, http.StatusUnauthorized, ErrorResponse{Error: "invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		writeJSON(w, http.StatusUnauthorized, ErrorResponse{Error: "invalid email or password"})
		return
	}

	tokenStr, err := generateJWT(*user)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, ErrorResponse{Error: "failed to generate token"})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    tokenStr,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
		Secure:   false, // Set to true in prod with HTTPS
		SameSite: http.SameSiteLaxMode,
	})

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"ok": true,
		"user": AuthUserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Role:  user.Role,
		},
	})
}

func handleMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, ErrorResponse{Error: "method not allowed"})
		return
	}

	userID := r.Header.Get("X-User-ID")
	
	mu.RLock()
	user := findUserByID(userID)
	mu.RUnlock()

	if user == nil {
		writeJSON(w, http.StatusUnauthorized, ErrorResponse{Error: "user not found"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"ok": true,
		"user": AuthUserResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Role:  user.Role,
		},
	})
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, ErrorResponse{Error: "method not allowed"})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func handleInvites(w http.ResponseWriter, r *http.Request) {
	role := r.Header.Get("X-User-Role")
	if role != "Admin" {
		writeJSON(w, http.StatusForbidden, ErrorResponse{Error: "only admins can manage invites"})
		return
	}

	if r.Method == http.MethodGet {
		mu.RLock()
		defer mu.RUnlock()
		writeJSON(w, http.StatusOK, map[string]interface{}{"invites": invites})
		return
	}

	if r.Method == http.MethodPost {
		b := make([]byte, 16)
		rand.Read(b)
		token := hex.EncodeToString(b)

		mu.Lock()
		defer mu.Unlock()

		inv := Invite{
			ID:        fmt.Sprintf("%d", time.Now().UnixNano()),
			Token:     token,
			CreatedBy: r.Header.Get("X-User-ID"),
			Used:      false,
			CreatedAt: time.Now(),
		}
		invites = append(invites, inv)

		if err := saveInvites(); err != nil {
			log.Printf("failed to save invites: %v", err)
			writeJSON(w, http.StatusInternalServerError, ErrorResponse{Error: "internal server error"})
			return
		}

		writeJSON(w, http.StatusCreated, map[string]interface{}{
			"ok":     true,
			"invite": inv,
		})
		return
	}

	writeJSON(w, http.StatusMethodNotAllowed, ErrorResponse{Error: "method not allowed"})
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	if err := loadData(); err != nil {
		log.Fatalf("failed to load data: %v", err)
	}

	http.HandleFunc("/auth/register", corsMiddleware(handleRegister))
	http.HandleFunc("/auth/login", corsMiddleware(handleLogin))
	http.HandleFunc("/auth/logout", corsMiddleware(handleLogout))
	http.HandleFunc("/api/auth/me", corsMiddleware(authMiddleware(handleMe)))
	http.HandleFunc("/api/invites", corsMiddleware(authMiddleware(handleInvites)))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Draftvo backend listening on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
