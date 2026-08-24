export const IS_TAURI = typeof window !== 'undefined' && '__TAURI__' in window;

// When running in Tauri, we must point to the absolute URL of the production backend
// When running in Docker/Web, we can use the relative `/api` or the same origin.
export const BACKEND_URL = IS_TAURI 
  ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080")
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"); // Using localhost:8080 for dev in both for now

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const { useAuthStore } = await import('../store/authStore');
  const token = useAuthStore.getState().token;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}
