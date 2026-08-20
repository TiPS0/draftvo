# Architecture Audit: Task Persistence

## Overview
This document outlines the validated architecture for persisting tasks in the application, moving from a purely ephemeral in-memory state to a robust, production-ready system.

## 1. Primary Architecture Strategy
**Hybrid Local-First**
- **Client State**: Zustand will hold the immediate state for ultra-fast, zero-latency UI updates.
- **Local Persistence**: We will use Zustand's `persist` middleware to save state to the browser's `localStorage`. This guarantees the app is fully functional offline and persists across page reloads.
- **Remote Sync**: A background process will mirror the local state to a remote database (e.g., Supabase or a custom backend) to ensure tasks sync across the user's multiple devices.

## 2. Offline Edge Case Handling
**Background Sync Queue**
- When a user creates or modifies a task while offline, the task is immediately saved to `localStorage`.
- The task schema will be expanded to include a `syncStatus` flag (e.g., `pending`, `synced`, `failed`).
- When the application boots up (or detects network restoration), a background worker will scan for tasks marked as `pending` and push them to the backend API.

## 3. Conflict Resolution & Deletions
**Soft Deletes**
- To prevent destructive merge conflicts (e.g., one device deletes a task while another device edits it offline), we will implement a "Soft Delete" pattern.
- The `deleteTask` action will no longer remove the object from the array/database. Instead, it will flag the task with `is_deleted: true`.
- The UI filters (in `TaskBoard.tsx`) will be updated to hide any task where `is_deleted === true`.
- The backend will easily merge these boolean flags without throwing "Row Not Found" foreign key constraints.

## Next Implementation Steps
1. Add `zustand/middleware` (`persist`) to `taskStore.ts`.
2. Update the `Task` interface to support `syncStatus` and `is_deleted`.
3. Refactor the `TaskBoard` filters to ignore soft-deleted tasks.
4. Scaffold the background sync logic (to be connected to the real DB API later).
