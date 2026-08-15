import { TaskBoard } from "../_components/TaskBoard";
import { RealTimeClock } from "../_components/RealTimeClock";

export default async function HomePage() {
  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-8 bg-[var(--color-surface-muted)]">
        <h1 className="text-[var(--font-size-md)] font-[600] text-[var(--color-text-primary)]">
          My Tasks
        </h1>
        <div className="flex items-center gap-2 text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
          <RealTimeClock />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-8 py-8 w-full">
        <TaskBoard />
      </div>
    </>
  );
}
