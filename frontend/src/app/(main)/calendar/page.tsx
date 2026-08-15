import React from "react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full bg-[var(--color-surface-muted)]">
      <header className="px-6 py-4 border-b border-[var(--color-surface-raised)] flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Calendar</h1>
      </header>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <p className="text-sm">Calendar template content goes here.</p>
        </div>
      </div>
    </div>
  );
}
