"use client";

import React, { useState } from "react";

const FILTER_TABS = ["All", "Pending", "In Progress", "Done"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

interface Task {
  id: string;
  title: string;
  status: "Pending" | "In Progress" | "Done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

const SAMPLE_TASKS: Task[] = [
  { id: "1", title: "Review design tokens in log-ui.md", status: "Done", priority: "high", dueDate: "Today" },
  { id: "2", title: "Implement register & login flow", status: "In Progress", priority: "high", dueDate: "Today" },
  { id: "3", title: "Set up Go backend auth endpoints", status: "Pending", priority: "medium", dueDate: "Tomorrow" },
  { id: "4", title: "Add unit tests for auth middleware", status: "Pending", priority: "low" },
];

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
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  const filtered = tasks.filter(
    (t) => activeFilter === "All" || t.status === activeFilter
  );

  function toggleDone(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, status: t.status === "Done" ? "Pending" : "Done" };
      })
    );
  }

  function addTask() {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        status: "Pending",
        priority: "medium",
      },
    ]);
    setNewTaskTitle("");
    setAddingTask(false);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filter tabs */}
      <div className="flex items-center gap-1" role="tablist" aria-label="Task filter">
        {FILTER_TABS.map((tab) => {
          const isActive = tab === activeFilter;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab)}
              className={[
                "px-3 py-1.5 rounded-[var(--radius-xs)] text-[var(--font-size-sm)] transition-all duration-[var(--motion-normal)]",
                "focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] focus-visible:outline-offset-1",
                isActive
                  ? "bg-white text-[var(--color-text-primary)] font-[600] shadow-[var(--shadow-1)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(42,28,0,0.04)]",
              ].join(" ")}
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1.5 text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
                  {tasks.filter((t) => t.status === tab).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-1.5">
        {filtered.length === 0 && (
          <EmptyState filter={activeFilter} onAdd={() => setAddingTask(true)} />
        )}

        {filtered.map((task) => (
          <div
            key={task.id}
            className={[
              "flex items-start gap-3 px-3.5 py-3 rounded-[var(--radius-xs)] bg-white group",
              "border border-[rgba(42,28,0,0.07)] hover:border-[rgba(42,28,0,0.12)]",
              "transition-all duration-[var(--motion-normal)] shadow-sm",
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
                    : "text-[var(--color-text-primary)]",
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
                "shrink-0 self-start text-[10px] font-[600] uppercase tracking-wide px-1.5 py-0.5 rounded-[var(--radius-xs)]",
                priorityColor[task.priority],
              ].join(" ")}
            >
              {task.priority}
            </span>
          </div>
        ))}

        {/* Add task row */}
        {addingTask ? (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[var(--radius-xs)] bg-white border border-[var(--color-surface-strong)] shadow-[0_0_0_3px_rgba(39,131,222,0.15)]">
            <input
              autoFocus
              type="text"
              placeholder="Task name…"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
                if (e.key === "Escape") {
                  setAddingTask(false);
                  setNewTaskTitle("");
                }
              }}
              className="flex-1 text-[var(--font-size-sm)] text-[var(--color-text-primary)] bg-transparent outline-none placeholder:text-[var(--color-text-tertiary)]"
            />
            <button
              onClick={addTask}
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
            id="add-task-btn"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-[var(--radius-xs)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(42,28,0,0.04)] transition-colors duration-[var(--motion-fast)] text-[var(--font-size-sm)] w-full text-left focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)]"
          >
            <PlusIcon />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ filter, onAdd }: { filter: FilterTab; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="w-10 h-10 rounded-full bg-[rgba(42,28,0,0.06)] flex items-center justify-center">
        <TaskEmptyIcon />
      </div>
      <div>
        <p className="text-[var(--font-size-sm)] font-[500] text-[var(--color-text-primary)]">
          No {filter === "All" ? "" : filter.toLowerCase()} tasks
        </p>
        <p className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] mt-0.5">
          {filter === "All" ? "Add your first task to get started." : `No tasks with status "${filter}".`}
        </p>
      </div>
      {filter === "All" && (
        <button
          onClick={onAdd}
          className="mt-1 px-4 py-2 rounded-[var(--radius-md)] text-[var(--font-size-sm)] font-[500] bg-[var(--color-surface-strong)] text-white hover:bg-[#1e6fc4] transition-colors duration-[var(--motion-normal)] focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] focus-visible:outline-offset-2"
        >
          Add task
        </button>
      )}
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
function TaskEmptyIcon() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
