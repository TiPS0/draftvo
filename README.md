<div align="center">

# Draftvo

**The unified workspace bridging technical and non-technical workflows.**

</div>

---

Draftvo is a workspace tailored for cross-functional teams to store documents, manage data, write API specifications, plan via calendars, and communicate seamlessly with external stakeholders (vendors, outsourcers, leadership) via PDF exports and integrated email.

## ✨ Core Feature Pillars

| Feature                    | Description                                                                                    |
| :------------------------- | :--------------------------------------------------------------------------------------------- |
| 📝 **The Workspace**       | Block-based document editing, data file storage, and API spec rendering.                       |
| 📅 **Calendar & Planning** | Visual calendar views linked to documents for project roadmapping.                             |
| 📄 **The Export Engine**   | High-quality, template-driven PDF generation designed for external communication.              |
| 📧 **Communication Hub**   | Native email sending capabilities directly from the workspace to share docs or alerts.         |
| ⚡ **Workflow Automation** | Webhook architecture designed to connect natively with tools like n8n.                         |
| 🔐 **Authentication**      | Local auth (email/password + invite tokens) stored via a Go backend.                           |
| 🖥️ **Desktop App**        | Native desktop application (macOS & Windows) built with Tauri v2, sharing the same backend.   |

---

## 🏗️ Technical Architecture

This project is a **pnpm Monorepo** with three workspaces:

```text
draftvo/
├── frontend/        # Next.js 16 (React 19, Tailwind CSS v4)
├── backend/         # Go HTTP API server (JWT auth, flat-file storage)
├── desktop/         # Tauri v2 desktop app (Rust shell + WebView)
├── docs/            # AI-optimized documentation & research
└── package.json     # Root monorepo scripts
```

### How it fits together

```
┌─────────────────────────────────────────────────────┐
│  Browser / Tauri WebView                            │
│  ┌─────────────────────────────────────────────┐   │
│  │  Next.js 16 Frontend (React 19 + Tailwind)  │   │
│  │  Client-side auth (Zustand + localStorage)  │   │
│  └─────────────────────────────────────────────┘   │
│                    ↕ HTTP / Bearer JWT              │
└─────────────────────────────────────────────────────┘
                    ↕ :8080
┌─────────────────────────────────────────────────────┐
│  Go Backend (single binary)                         │
│  /auth/login  /auth/register  /api/invites ...      │
│  Data stored in users.json + invites.json           │
└─────────────────────────────────────────────────────┘
```

Both the **browser (web)** and the **Tauri desktop app** talk to the same Go backend. Data is fully shared between platforms.

---

## 📦 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Frontend runtime |
| pnpm | 9+ | Package manager |
| Go | 1.20+ | Backend server |
| Rust | 1.77.2+ | Desktop (Tauri) only |
| Tauri CLI | 2.x | Desktop (Tauri) only |

Install Tauri CLI (for desktop development only):
```bash
cargo install tauri-cli
```

### Installation

```bash
git clone https://github.com/TiPS0/draftvo.git
cd draftvo
pnpm install
```

---

## 🚀 Development

### Web (Browser)

Starts the frontend (port 3000) and backend (port 8080) in parallel:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and register a new account at `/register`.

### Desktop App

Starts the backend, frontend, **and** opens the native Tauri desktop window:

```bash
pnpm desktop
```

> The first run will compile the Rust codebase and may take 1–2 minutes.

---

## 📦 Building for Production

### Desktop App

```bash
# macOS (.dmg + .app)
pnpm build:mac

# Windows (.exe + .msi) — must run on a Windows host or CI
pnpm build:win
```

Output files are automatically moved to `desktop/releases/macos/` or `desktop/releases/windows/`.

### Web / Docker

```bash
pnpm build
```

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
