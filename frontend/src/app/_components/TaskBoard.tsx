"use client";

import React, { useState } from "react";
import { useTaskStore, Task } from "../../store/taskStore";

const FILTER_TABS = ["All", "Pending", "In Progress", "Done"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

const priorityColor: Record<Task["priority"], string> = {
  high: "bg-[rgba(217,78,63,0.12)] text-[#d94e3f]",
  medium: "bg-[rgba(234,155,37,0.12)] text-[#b87d1a]",
  low: "bg-[rgba(42,28,0,0.06)] text-[var(--color-text-tertiary)]",
};

const statusIcon: Record<Task["status"], React.ReactNode> = {
  Pending: <CircleIcon />,
  "In Progress": <HalfCircleIcon />,
  Done: <CheckCircleIcon />,
};

export function TaskBoard() {
  const { tasks, addTask, toggleDone, deleteTask } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const filtered = tasks.filter(
    (t) => activeFilter === "All" || t.status === activeFilter
  );

  function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle);
    setNewTaskTitle("");
    setAddingTask(false);
  }

  return (
    <div className="flex flex-col flex-1 w-full relative">
      {/* Notion Tab Bar */}
      <div className="sticky top-11 z-20 flex items-center min-h-[40px] px-[96px] w-full bg-[var(--color-surface-muted)] border-b border-[rgba(42,28,0,0.06)]">
        <div className="flex items-center h-[40px] w-full">
          <div className="flex-1 flex items-center h-full ml-1">
            <button className="flex items-center h-[32px] px-2.5 rounded hover:bg-[rgba(42,28,0,0.06)] text-xs text-[var(--color-text-secondary)] font-medium transition-colors">
              <span className="w-4 h-4 mr-1.5 opacity-60">
                 <svg viewBox="0 0 16 16" className="w-full h-full fill-current"><path d="M2.4 3.7a.7.7 0 1 0 0 1.4h11.2a.7.7 0 1 0 0-1.4zm9.5 3.594H4.1a.7.7 0 1 0 0 1.4h7.8a.7.7 0 1 0 0-1.4M5.8 10.9a.7.7 0 1 0 0 1.4h4.4a.7.7 0 1 0 0-1.4z"></path></svg>
              </span>
              <span className="truncate max-w-[220px]">My Drafts</span>
            </button>
          </div>
          <div className="flex items-center justify-end h-full gap-0.5">
             <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[rgba(42,28,0,0.06)] text-[var(--color-text-secondary)] transition-colors" title="Filter" onClick={() => setActiveFilter(activeFilter === "All" ? "Pending" : "All")}>
               <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[var(--color-text-secondary)]"><path d="M2.4 3.7a.7.7 0 1 0 0 1.4h11.2a.7.7 0 1 0 0-1.4zm9.5 3.594H4.1a.7.7 0 1 0 0 1.4h7.8a.7.7 0 1 0 0-1.4M5.8 10.9a.7.7 0 1 0 0 1.4h4.4a.7.7 0 1 0 0-1.4z"></path></svg>
             </button>
             <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[rgba(42,28,0,0.06)] text-[var(--color-text-secondary)] transition-colors" title="Sort">
               <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[var(--color-text-secondary)] rotate-180"><path d="M11.348 2.672a.625.625 0 0 0-.884 0L7.666 5.471a.625.625 0 1 0 .884.883l1.731-1.73v8.262a.625.625 0 1 0 1.25 0V4.623l1.732 1.731a.625.625 0 0 0 .884-.883zM5.093 2.49a.625.625 0 0 0-.625.624v8.263L2.737 9.646a.625.625 0 1 0-.884.883l2.798 2.799c.244.244.64.244.884 0l2.798-2.798a.625.625 0 0 0-.884-.884l-1.73 1.73V3.115a.625.625 0 0 0-.626-.625"></path></svg>
             </button>
             <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[rgba(42,28,0,0.06)] text-[var(--color-text-secondary)] transition-colors" title="Search">
               <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[var(--color-text-secondary)]"><path d="M7.1 1.975a5.125 5.125 0 1 0 3.155 9.164l3.107 3.107a.625.625 0 1 0 .884-.884l-3.107-3.107A5.125 5.125 0 0 0 7.1 1.975M3.225 7.1a3.875 3.875 0 1 1 7.75 0 3.875 3.875 0 0 1-7.75 0"></path></svg>
             </button>
             <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[rgba(42,28,0,0.06)] text-[var(--color-text-secondary)] transition-colors" title="Settings">
               <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[var(--color-text-secondary)]"><path d="M2.25 5.531h5.692a2.126 2.126 0 0 0 4.116 0h1.692a.625.625 0 1 0 0-1.25H12a2.126 2.126 0 0 0-4 0H2.25a.625.625 0 1 0 0 1.25M10 4.125a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75m-4 9c.921 0 1.706-.586 2-1.406h5.75a.625.625 0 0 0 0-1.25H8.058a2.126 2.126 0 0 0-4.116 0H2.25a.625.625 0 1 0 0 1.25H4a2.13 2.13 0 0 0 2 1.406m0-1.25a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75"></path></svg>
             </button>
             <button onClick={() => setAddingTask(true)} className="ml-1.5 flex items-center h-[28px] px-2.5 rounded bg-[var(--color-surface-strong)] text-white hover:opacity-90 text-sm font-medium transition-opacity">
               New task
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full px-[96px] py-4 relative">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col pt-[100px] pb-[32px] items-center justify-center text-center text-[14px] text-[var(--color-text-tertiary)] w-full">
            <svg viewBox="0 0 20 20" className="w-12 h-12 fill-[var(--color-text-tertiary)] mb-4 opacity-50">
              <path d="M6.75 2.545a.55.55 0 0 1 .55-.55h5.4a.55.55 0 0 1 0 1.1H7.3a.55.55 0 0 1-.55-.55m-1.25 1.7a.55.55 0 1 0 0 1.1h9a.55.55 0 0 0 0-1.1zm7.036 5.847a.625.625 0 1 0-1.072-.643l-1.953 3.256-1.036-1.208a.625.625 0 1 0-.95.813l1.6 1.867a.625.625 0 0 0 1.011-.085z"></path>
              <path d="M5.088 6.42a2.125 2.125 0 0 0-2.125 2.125v6.45c0 1.174.951 2.125 2.125 2.125h9.825a2.125 2.125 0 0 0 2.125-2.125v-6.45a2.125 2.125 0 0 0-2.125-2.125zm-.875 2.125c0-.483.392-.875.875-.875h9.825c.483 0 .875.392.875.875v6.45a.875.875 0 0 1-.875.875H5.088a.875.875 0 0 1-.875-.875z"></path>
            </svg>
            <div className="flex items-center justify-center gap-1 text-[var(--color-text-tertiary)]">
              See all tasks assigned to you here.
            </div>
            <button className="mt-2 text-[#2783de] hover:underline cursor-pointer font-medium" onClick={() => setAddingTask(true)}>
              Configure your task sources
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 w-full max-w-[800px]">
            {filtered.map((task) => (
              <div
                key={task.id}
                className={[
                  "flex items-start gap-3 px-3.5 py-3 rounded-[var(--radius-xs)] bg-transparent group border-b border-[rgba(42,28,0,0.06)] hover:bg-[rgba(42,28,0,0.02)]",
                  "transition-colors duration-[var(--motion-fast)]",
                ].join(" ")}
              >
                <button
                  onClick={() => toggleDone(task.id)}
                  aria-label={task.status === "Done" ? "Mark as pending" : "Mark as done"}
                  className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-surface-strong)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] rounded"
                >
                  {statusIcon[task.status]}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={[
                      "text-[var(--font-size-sm)] leading-5",
                      task.status === "Done"
                        ? "line-through text-[var(--color-text-tertiary)]"
                        : "text-[var(--color-text-primary)] font-medium",
                    ].join(" ")}
                  >
                    {task.title}
                  </p>
                  {task.dueDate && task.status !== "Done" && (
                    <p className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] mt-0.5">
                      {task.dueDate}
                    </p>
                  )}
                </div>

                <span
                  className={[
                    "shrink-0 self-start text-[10px] font-[600] uppercase tracking-wide px-1.5 py-0.5 rounded-[var(--radius-xs)] opacity-0 group-hover:opacity-100 transition-opacity",
                    priorityColor[task.priority],
                  ].join(" ")}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="shrink-0 w-5 h-5 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[#d94e3f] hover:bg-[rgba(217,78,63,0.12)] opacity-0 group-hover:opacity-100 transition-all duration-[var(--motion-fast)] focus-visible:opacity-100 rounded"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}

            {/* Add task row */}
            {addingTask ? (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[var(--radius-xs)] bg-[var(--color-surface-muted)] border border-[var(--color-surface-strong)] shadow-[0_0_0_3px_rgba(39,131,222,0.15)] mt-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Task name…"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask();
                    if (e.key === "Escape") {
                      setAddingTask(false);
                      setNewTaskTitle("");
                    }
                  }}
                  className="flex-1 text-[var(--font-size-sm)] text-[var(--color-text-primary)] bg-transparent outline-none placeholder:text-[var(--color-text-tertiary)]"
                />
                <button
                  onClick={handleAddTask}
                  className="text-[var(--font-size-xs)] font-[600] text-[var(--color-surface-strong)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] rounded"
                >
                  Add
                </button>
                <button
                  onClick={() => { setAddingTask(false); setNewTaskTitle(""); }}
                  className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingTask(true)}
                id="add-task-btn-notion"
                className="flex items-center gap-2 px-3.5 py-2 mt-2 rounded-[var(--radius-xs)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(42,28,0,0.04)] transition-colors duration-[var(--motion-fast)] text-[var(--font-size-sm)] w-full text-left focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] opacity-50 hover:opacity-100"
              >
                <PlusIcon />
                New task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Icons ──────────────────────────────── */
function CircleIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
function HalfCircleIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" /><path d="M8 2.5A5.5 5.5 0 018 13.5V2.5z" fill="currentColor" opacity="0.3" /></svg>;
}
function CheckCircleIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="rgba(39,131,222,0.15)" stroke="#2783de" strokeWidth="1.4" /><path d="M5.5 8l2 2 3-3" stroke="#2783de" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PlusIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}
