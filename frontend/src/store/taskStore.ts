import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  status: "Pending" | "In Progress" | "Done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

interface TaskStore {
  tasks: Task[];
  addTask: (title: string) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [], // Start empty
  addTask: (title: string) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now().toString(),
          title: title.trim(),
          status: "Pending",
          priority: "medium",
        },
      ],
    })),
  deleteTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  toggleDone: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Done" ? "Pending" : "Done" }
          : t
      ),
    })),
}));
