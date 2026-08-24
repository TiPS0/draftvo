"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function AuthHeader() {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between pointer-events-none">
      <Link href="/" className="flex items-center gap-2 pointer-events-auto">
        <DraftvoLogo />
        <span className="text-[var(--font-size-md)] font-[600] text-[var(--color-text-primary)] tracking-tight">
          Draftvo
        </span>
      </Link>
      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />; // placeholder
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      title="Toggle theme"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function DraftvoLogo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill="#211b17" />
      <path
        d="M8 14C8 10.686 10.686 8 14 8H18V12H14C12.895 12 12 12.895 12 14C12 15.105 12.895 16 14 16H18V20H14C10.686 20 8 17.314 8 14Z"
        fill="#2783de"
      />
      <path d="M16 11H20V17H16V11Z" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );
}
