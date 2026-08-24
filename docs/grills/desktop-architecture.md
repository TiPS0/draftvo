# Desktop Architecture Plan

## Executive Summary
This document validates the architecture for integrating Tauri as a desktop application wrapper around the existing Next.js frontend, while maintaining support for the Dockerized web deployment.

## Issues Addressed
1. **Next.js Middleware Conflict**: `proxy.ts` relies on Next.js Server logic to intercept requests and check JWT cookies. Tauri requires `output: "export"`, which strictly forbids server-side middleware and Next.js APIs.
2. **CORS and API Routing**: Desktop (Tauri) runs locally and must communicate with a remote API, unlike Docker which can use the same domain.

## Validated Architecture
- **Single Frontend**: The monorepo will maintain a single Next.js `frontend` application.
- **Client-Side Auth Shift**: `proxy.ts` will be removed. Route protection and authentication state will be managed via React Client Components (e.g., Zustand + higher-order components) to allow the app to be fully statically exported.
- **Dynamic Config**: `next.config.ts` will conditionally set `output: "export"` based on the environment (e.g., `TAURI_BUILD=true`).
- **Dynamic API Base URL**: API clients will detect the Tauri environment and route requests to the production backend, while falling back to standard behavior in Docker.

## Audit Checklist
- [x] Codebase dependencies checked
- [x] Web framework compatibility verified (Next.js Static Export vs Middleware)
- [x] Tauri integration requirements validated
- [x] Auth flow secure (Moving to client-side auth state requires strict API-level validation of JWTs)
