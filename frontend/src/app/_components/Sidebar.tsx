"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SearchModal } from "./SearchModal";
import { SettingsModal } from "./SettingsModal";

interface SidebarProps {
  activePath?: string;
  userName?: string;
  userEmail?: string;
  onCollapse?: () => void;
}

export function Sidebar({ activePath = "/", userName = "You", userEmail = "", onCollapse }: SidebarProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'home' | 'inbox'>('home');

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isHomeActive = activeTab === "home";
  const isInboxActive = activeTab === "inbox";

  return (
    <aside
      className="flex flex-col w-full h-screen bg-background"
      aria-label="Main navigation"
    >
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userName={userName} />

      {/* Header */}
      <div className="flex flex-col px-3 pt-3 pb-2 gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 hover:bg-black/5 p-1 rounded cursor-pointer transition-colors">
            <div className="w-5 h-5 rounded overflow-hidden relative">
              <DraftvoLogo />
            </div>
            <span className="text-[var(--font-size-sm)] font-[500] text-[var(--color-text-primary)] truncate max-w-[150px]">
              Draftvo
            </span>
          </div>
          <button
            onClick={onCollapse}
            className="text-[var(--color-text-tertiary)] hover:bg-black/5 hover:text-[var(--color-text-primary)] w-8 h-8 flex items-center justify-center rounded-md transition-colors"
            title="Close sidebar"
          >
            <ChevronsLeftIcon />
          </button>
        </div>

        {/* Horizontal Navigation */}
        <div className="flex items-center mt-1 text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`inline-flex items-center h-8 px-2 rounded-full transition-[max-width,background-color] duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isHomeActive ? 'bg-black/5 text-[var(--color-text-primary)] max-w-[120px]' : 'hover:bg-black/5 hover:text-[var(--color-text-primary)] max-w-[32px]'}`}
              title="Home"
            >
              <HomeIcon className="shrink-0" />
              <span className={`text-xs font-medium ml-1.5 transition-opacity duration-300 ${isHomeActive ? 'opacity-100' : 'opacity-0'}`}>
                Home
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`inline-flex items-center h-8 px-2 rounded-full transition-[max-width,background-color] duration-300 ease-in-out overflow-hidden whitespace-nowrap ${isInboxActive ? 'bg-black/5 text-[var(--color-text-primary)] max-w-[120px]' : 'hover:bg-black/5 hover:text-[var(--color-text-primary)] max-w-[32px]'}`}
              title="Inbox"
            >
              <InboxIcon className="shrink-0" />
              <span className={`text-xs font-medium ml-1.5 transition-opacity duration-300 ${isInboxActive ? 'opacity-100' : 'opacity-0'}`}>
                Inbox
              </span>
            </button>
          </div>

          <div className="flex-1" />

          <button
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5 hover:text-[var(--color-text-primary)] shrink-0"
            title="Search"
          >
            <SearchIcon className="shrink-0" />
          </button>
        </div>
      </div>

      {/* Main sidebar body area */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-0.5">
        {activeTab === 'home' ? (
          <>
            <SidebarMenuItem href="/" icon={<CheckSquareIcon />} label="My Drafts" activePath={activePath} />
            <SidebarMenuItem href="/calendar" icon={<CalendarIcon />} label="Calendar" activePath={activePath} />
            <SidebarMenuItem href="/notes" icon={<BookIcon />} label="Notes" activePath={activePath} />
            <SidebarMenuItem href="/contacts" icon={<UsersIcon />} label="Contacts" activePath={activePath} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <CheckIcon className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-[13px] font-medium text-[var(--color-text-secondary)] mb-4">You're all caught up</p>
          </div>
        )}
      </nav>

      {/* User / Settings */}
      <div className="px-3 py-3 flex items-center gap-2.5">
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
          onClick={() => setIsSettingsOpen(true)}
          id="settings-btn"
          title="Settings"
          aria-label="Settings"
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(42,28,0,0.06)] transition-colors duration-[var(--motion-fast)] focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)]"
        >
          <GearIcon />
        </button>
      </div>
    </aside>
  );
}

/* ── Icons ──────────────────────────────── */

function DraftvoLogo() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" fill="#211b17" />
      <path d="M8 14C8 10.686 10.686 8 14 8H18V12H14C12.895 12 12 12.895 12 14C12 15.105 12.895 16 14 16H18V20H14C10.686 20 8 17.314 8 14Z" fill="#2783de" />
      <path d="M16 11H20V17H16V11Z" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function ChevronsLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7"></polyline>
      <polyline points="18 17 13 12 18 7"></polyline>
    </svg>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
    </svg>
  );
}
function SidebarMenuItem({ href, icon, label, activePath }: { href: string, icon: React.ReactNode, label: string, activePath: string }) {
  const isActive = activePath === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] font-[500] transition-colors ${isActive ? 'bg-black/5 text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-black/5 hover:text-[var(--color-text-primary)]'}`}
    >
      <div className={`w-4 h-4 flex items-center justify-center ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`}>
        {icon}
      </div>
      <span className="truncate">{label}</span>
    </Link>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

function CheckSquareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  );
}

function ShapesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.38 2 3 9.42 10.58 15 16 7.58 8.38 2Z"></path>
      <path d="M16 11c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5Z"></path>
    </svg>
  );
}

function HelpCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path>
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
