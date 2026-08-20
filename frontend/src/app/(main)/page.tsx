import { TaskBoard } from "../_components/TaskBoard";
import { RealTimeClock } from "../_components/RealTimeClock";

function TopbarActionButtons() {
  return (
    <div className="flex items-center gap-2 pr-2">
      <div className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] font-medium h-7 flex items-center justify-center">
        <RealTimeClock />
      </div>
      <div className="text-[var(--color-text-tertiary)] font-medium text-xs">|</div>
      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[rgba(42,28,0,0.06)] text-[var(--color-text-secondary)] transition-colors">
        <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
          <path d="M9.978 7.154c-.804 0-1.333.456-1.438.874a.625.625 0 0 1-1.213-.303c.28-1.121 1.44-1.82 2.65-1.82 1.365 0 2.714.905 2.714 2.298 0 .812-.49 1.477-1.13 1.872l-.755.516a.84.84 0 0 0-.381.677.625.625 0 1 1-1.25 0c0-.688.36-1.318.921-1.706l.003-.002.784-.535.014-.008c.374-.228.544-.537.544-.814 0-.459-.517-1.049-1.463-1.049m.662 6.336a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0"></path>
          <path d="M2.375 10a7.625 7.625 0 1 1 15.25 0 7.625 7.625 0 0 1-15.25 0M10 3.625a6.375 6.375 0 1 0 0 12.75 6.375 6.375 0 0 0 0-12.75"></path>
        </svg>
      </button>
    </div>
  );
}

export default async function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--color-surface-muted)]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-11 px-3 bg-[var(--color-surface-muted)] w-full">
        <div className="flex-1" />
        <TopbarActionButtons />
      </header>

      {/* Content */}
      <div className="flex flex-col w-full max-w-[1440px] mx-auto pb-0">
        <div className="w-full flex flex-col flex-shrink-0">
          <div className="w-full px-[96px] transition-[width] duration-200">
            {/* Add cover */}
            <div className="flex pt-1 pb-1 justify-start flex-wrap mt-2 text-[var(--color-text-tertiary)]">
              <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-[rgba(42,28,0,0.06)] rounded opacity-0 hover:opacity-100 transition-opacity">
                <svg viewBox="2.37 4.12 15.25 11.75" className="w-4 h-4 fill-current"><path d="M2.375 6.25c0-1.174.951-2.125 2.125-2.125h11c1.174 0 2.125.951 2.125 2.125v7.5a2.125 2.125 0 0 1-2.125 2.125h-11a2.125 2.125 0 0 1-2.125-2.125zm1.25 7.5c0 .483.392.875.875.875h11a.875.875 0 0 0 .875-.875v-2.79l-2.87-2.87a.625.625 0 0 0-.884 0l-4.137 4.135-1.98-1.98a.625.625 0 0 0-.883 0L3.625 12.24zM8.5 9.31a1.5 1.5 0 0 0 1.33-.805 1.094 1.094 0 0 1-.702-2.058A1.5 1.5 0 1 0 8.5 9.31"></path></svg>
                <span className="text-sm font-medium">Add cover</span>
              </button>
            </div>
            {/* Page Title */}
            <div className="mb-2">
              <h1 className="text-[32px] font-[700] leading-[1.2] text-[var(--color-text-primary)] cursor-default px-2 outline-none">
                My Drafts
              </h1>
            </div>
          </div>
        </div>
        
        {/* Task Board Area */}
        <div className="w-full relative flex-1 flex flex-col">
          <TaskBoard />
        </div>
      </div>
    </div>
  );
}
