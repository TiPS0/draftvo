---
version: 1.0.0
updated_at: 2026-08-13
---

# Naming Conventions

**Purpose:** Enforce consistent naming for files, folders, variables, types, and databases across the BQuik POS project, bridging global standards with Expo Router-specific patterns.

## Strict Anti-Patterns (NEVER DO THIS)

- **NEVER** use spaces in file or folder names (use `-` instead).
- **NEVER** mix cases for generic files (avoid the Case-Sensitivity Trap). `Logo.png` and `logo.png` are different on Linux.
- **NEVER** use hardcoded hex colors or generic terms (e.g. `red` or `blue`) for naming UI states; always use theme tokens.

## Required Patterns (ALWAYS DO THIS)

- **ALWAYS** use `kebab-case` for generic files, folders, URLs, and standard documentation (e.g., `workflow-flow.md`, `agent-plan/`).
- **ALWAYS** use `camelCase` for TypeScript variables, functions, and JSON/API payloads (e.g., `const jobNumber = 1;`).
- **ALWAYS** use `PascalCase` for TypeScript types, interfaces, classes, and UI Components (e.g., `type JobTask`, `DriverMap.tsx`).
- **ALWAYS** use `snake_case` for database tables and columns (e.g., `job_task`, `customer_id`).
- **ALWAYS** use `SCREAMING_SNAKE_CASE` for environment variables and major architectural documentation (e.g., `API_KEY`, `DATABASE_SCHEMA.md`).

## Expo Router File-System Exceptions (CRITICAL)

Because this is a React Native (Expo Router) project, you must follow these specific file/folder structures which override the global `kebab-case` rule inside the `app/` folder:

- **Route Groups:** Use `(groupName)` or `(group-name)` (parentheses) for layout groups that do not appear in the URL path.
- **Layouts & Special Files:** Use `_` prefix (e.g., `_layout.tsx`) for Expo's structural layout files.
- **Dynamic Routes:** Use `[param].tsx` or `[...rest].tsx` (brackets) for dynamic route parameters.

## Example

**BAD:**
```ts
// Incorrect file naming and variable casing
// File: myComponent.tsx
const User_Profile = { first_name: "John" };
```

**GOOD:**
```ts
// Correct component naming and variable casing
// File: MyComponent.tsx
const userProfile = { firstName: "John" };
```
