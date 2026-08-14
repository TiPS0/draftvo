"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: "my-tasks", label: "My Tasks", href: "/", icon: <TaskIcon /> },
  { id: "inbox", label: "Inbox", href: "/inbox", icon: <InboxIcon /> },
  { id: "today", label: "Today", href: "/today", icon: <TodayIcon /> },
  { id: "projects", label: "Projects", href: "/projects", icon: <ProjectsIcon /> },
];

interface SidebarProps {
  activePath?: string;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ activePath = "/", userName = "You", userEmail = "" }: SidebarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside
      className="flex flex-col w-[220px] shrink-0 h-screen sticky top-0 bg-[#f0ede9] border-r border-[rgba(42,28,0,0.08)]"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-[rgba(42,28,0,0.08)]">
        <DraftationLogo />
        <span className="text-[var(--font-size-sm)] font-[600] text-[var(--color-text-primary)] tracking-tight">
          Draftation
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              id={`nav-${item.id}`}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex items-center gap-2.5 px-2.5 py-[7px] rounded-[var(--radius-xs)]",
                "text-[var(--font-size-sm)] transition-all duration-[var(--motion-normal)]",
                "focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] focus-visible:outline-offset-1",
                isActive
                  ? "bg-white text-[var(--color-text-primary)] font-[600] shadow-[var(--shadow-1)]"
                  : "text-[var(--color-text-secondary)] hover:bg-white/60 hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              <span className="w-4 h-4 shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-[rgba(42,28,0,0.08)] px-3 py-3 flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-full bg-[var(--color-surface-strong)] flex items-center justify-center text-white text-[10px] font-[700] shrink-0"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[var(--font-size-xs)] font-[600] text-[var(--color-text-primary)] truncate">
            {userName}
          </p>
          {userEmail && (
            <p className="text-[10px] text-[var(--color-text-tertiary)] truncate">
              {userEmail}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          id="logout-btn"
          title="Sign out"
          aria-label="Sign out"
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(42,28,0,0.06)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)]"
        >
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

/* ── Icons ──────────────────────────────── */

function DraftationLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#211b17" />
      <path d="M8 14C8 10.686 10.686 8 14 8H18V12H14C12.895 12 12 12.895 12 14C12 15.105 12.895 16 14 16H18V20H14C10.686 20 8 17.314 8 14Z" fill="#2783de" />
      <path d="M16 11H20V17H16V11Z" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2.5" />
      <path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 10h3l1.5 2h3L11 10h3V13a1 1 0 01-1 1H3a1 1 0 01-1-1v-3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10l2-7h8l2 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TodayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="2" />
      <path d="M5 2v2M11 2v2M2 7h12" strokeLinecap="round" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M2 4a1 1 0 011-1h4l1.5 2H13a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-2.5L10 5M13 7.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
