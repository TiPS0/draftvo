# Sidebar, Datetime, and Zustand Task Store

## Goal
1. Fix the missing sidebar expand button when the sidebar is collapsed (it's currently covered by `page.tsx`'s sticky header).
2. On the top-right of the main page, replace the star icon with the `RealTimeClock` component.
3. Migrate the local task state in `TaskBoard.tsx` to a Zustand global store. Start with an empty list. Add the ability to add tasks (already exists but now tied to Zustand) and delete tasks (new feature) to prove state management works.

## Proposed Changes

### `frontend/src/app/_components/AppLayout.tsx`
- Increase the `z-index` of the expand sidebar button (e.g., `z-[60]`) and adjust its `top` position so it is fully visible and clickable above the `page.tsx` topbar.

### `frontend/src/app/(main)/page.tsx`
- Remove the star icon in `TopbarActionButtons`.
- Import and use the `RealTimeClock` component next to the question mark icon.
- Style `RealTimeClock` to match the text and alignment of the icons.

### `frontend/src/store/taskStore.ts`
- Create a new Zustand store to manage `Task` state.
- Include actions: `addTask(title)`, `deleteTask(id)`, and `toggleDone(id)`.
- Initial state: `tasks = []`.

### `frontend/src/app/_components/TaskBoard.tsx`
- Remove local `useState` for tasks.
- Use `useTaskStore` for accessing tasks and dispatching actions.
- Add a trash/delete icon button to each task item.

## Validation
- I will run `pnpm tsc --noEmit` and check for errors, then iterate if needed.
