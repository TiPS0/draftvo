# Plan: Auth Theme Toggle & Desktop Config

## Goal
1. Add a dark/light mode toggle (moon/sun icon) to the auth screens (login and register).
2. Configure the Tauri desktop app:
   - Use the Draftvo logo for the application icon.
   - Increase the default window size to be more usable (e.g. 1200x800).
   - Set the application name appropriately.

## Steps
1. **Frontend Auth Theme Toggle**:
   - Update `frontend/src/app/(auth)/_components/AuthForm.tsx` to include a floating button at the top-right corner containing a sun/moon icon.
   - Use `next-themes` `useTheme` hook to toggle between `light` and `dark` modes.
2. **Desktop Icon**:
   - Locate the Draftvo logo used in `Sidebar.tsx` (usually an SVG or PNG in `public/`).
   - If it is an SVG, convert it or ensure we have a PNG version.
   - Run the Tauri icon generator to create all necessary `.icns`, `.ico`, and `.png` files in `desktop/src-tauri/icons`.
3. **Desktop Configuration**:
   - Edit `desktop/src-tauri/tauri.conf.json`.
   - Update `app.windows[0].width` to `1200` and `height` to `800`.
   - Ensure the window `title` is `Draftvo`.
4. **Validation**:
   - Run `pnpm --filter frontend build` (or Next.js type check) to ensure no errors.
   - Run `cargo tauri build` (or `cargo tauri check` if possible) to validate Tauri config.
