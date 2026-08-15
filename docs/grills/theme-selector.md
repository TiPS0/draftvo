# Theme Selector Architecture Audit

## Goal
Make the Theme selector in `SettingsModal.tsx` functional, store the user's preference in cache, and ensure a flicker-free dark mode implementation.

## Interrogation Results (Decisions Made)
- **Architecture**: Install `next-themes` (Industry standard, handles hydration flicker automatically).
- **Persistence**: Start with `localStorage` (Cache) via `next-themes`.
- **CSS Strategy**: Update Tailwind configuration to use `darkMode: 'class'`. (Since this project uses Tailwind v4 with `@import "tailwindcss";`, dark mode relies on CSS variables and variants. `next-themes` will toggle a `.dark` class on the `<html>` element).

## Implementation Plan
1. **Dependencies**: Run `pnpm add next-themes`.
2. **Provider Setup**: 
   - Create a `ThemeProvider` component (`src/app/_components/ThemeProvider.tsx`).
   - Wrap the main application layout (`src/app/layout.tsx`) with the `ThemeProvider`.
3. **Tailwind / CSS Integration**: 
   - Since Tailwind v4 handles dark mode via `variant`, we will define dark mode variables in `globals.css` inside a `.dark` block.
   - Example: 
     ```css
     .dark {
       --background: #191919;
       --color-text-primary: #ffffff;
       --color-surface-muted: #2d2d2d;
       --color-surface-raised: #363636;
     }
     ```
4. **UI Integration**: 
   - Update `SettingsModal.tsx` to import and use `useTheme()` from `next-themes`.
   - Ensure the modal is a client component (`"use client";`).
   - Bind the `<select>` value to `theme` and `onChange` to `(e) => setTheme(e.target.value)`.

## Logic Audit (Potential Failure Points Addressed)
- **Hydration Mismatch**: `next-themes` applies styles before React hydrates, which can cause warnings if `<html>` properties differ. I must add `suppressHydrationWarning` to the `<html>` or `<body>` tag in `src/app/layout.tsx`.
- **Server Side Rendering (SSR)**: The Theme selector `<select>` will initially render the server's guess (often 'system' or 'light'). To avoid a mismatch error on the select element itself, we will use a `mounted` state in `SettingsModal.tsx` to delay rendering the select's actual value until hydration completes.
