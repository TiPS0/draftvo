---
description: Always use native Tailwind v4 utilities and properly register CSS theme variables instead of arbitrary class strings.
globs: *.ts, *.tsx, *.css, *.html
version: 1.0.0
updated_at: 2026-08-20
---

# Tailwind v4 Theming & Native Utilities

**Purpose:** Ensure agents correctly leverage Tailwind v4's CSS-first theme configuration instead of relying on arbitrary variables which fail to compile and cause UI bugs.

## Strict Anti-Patterns (NEVER DO THIS)

- **NEVER** use arbitrary CSS variable classes for theme colors (e.g., `border-[var(--color-surface-raised)]` or `bg-[var(--color-surface-muted)]`).
- **NEVER** introduce a new color directly inline without registering it in the theme.
- **NEVER** attempt a sweeping project-wide refactor of legacy arbitrary classes unless specifically instructed. 

## Required Patterns (ALWAYS DO THIS)

- **ALWAYS** use native v4 utilities for theming (e.g., `border-surface-raised`, `bg-surface-muted`).
- **ALWAYS** define new colors in `frontend/src/app/globals.css` in three distinct places before using them:
  1. `:root` (for Light mode)
  2. `.dark` (for Dark mode)
  3. `@theme inline` block (so Tailwind v4 registers the utility natively)
- **ALWAYS** opportunistically refactor legacy arbitrary variable classes to native v4 utilities, but ONLY within the exact file you are actively editing.

## Example

**BAD:**
```tsx
// Using arbitrary variables which fail in v4
<div className="border border-[var(--color-surface-raised)] bg-[var(--color-surface-muted)]">
```

**GOOD:**
```tsx
// Using native utilities synced from globals.css @theme
<div className="border border-surface-raised bg-surface-muted">
```
