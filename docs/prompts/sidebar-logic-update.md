# Sidebar Logic Update

## Overview
Change the Home and Inbox top-navigation items in the sidebar from Next.js route `<Link>`s to local state buttons. The sidebar body content will dynamically switch between the Home menu (a list of navigation links) and the Inbox view (a caught-up message) based on this local state, without modifying the top-level application URL.

## Architecture & Logic
1. **Sidebar State:** Introduce `activeTab: 'home' | 'inbox'` state in `Sidebar.tsx`.
2. **Top Navigation Toggle:** The Home and Inbox pill buttons will set `activeTab`. They will no longer use `<Link>`.
3. **Sidebar Body - Home:**
   - When `activeTab === 'home'`, render a vertical list of links:
     - Try AI Meeting Notes (`/meeting-notes`)
     - Library (`/library`)
     - My Tasks (`/` - default route, matching the existing TaskBoard)
     - Marketplace (`/marketplace`)
     - Help (`/help`)
     - Trash (`/trash`)
   - The active state of these links is determined by `usePathname()`.
4. **Sidebar Body - Inbox:**
   - When `activeTab === 'inbox'`, render a "You're all caught up" view with a checkmark and "Edit filter" button.
5. **Route Clean up:** Delete `src/app/(main)/inbox/page.tsx` since the Inbox view is now local to the sidebar and doesn't have its own page route.

## Execution Steps
1. Delete `src/app/(main)/inbox/page.tsx` since Inbox is no longer a route.
2. Edit `Sidebar.tsx` to implement `activeTab` state.
3. Update Home/Inbox pills in `Sidebar.tsx` to act as buttons.
4. Implement the Home body content (Menu items) inside `Sidebar.tsx`.
5. Implement the Inbox body content inside `Sidebar.tsx`.
6. Run `pnpm tsc --noEmit` to validate.
