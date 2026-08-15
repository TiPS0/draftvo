"use client";

import React, { useEffect } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative flex flex-col w-full max-w-[1006px] h-[700px] max-h-[90vh] bg-[var(--color-surface-muted)] rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--color-surface-raised)]">
          <SearchIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search or ask a question in Draftvo..."
            className="flex-1 bg-transparent border-none outline-none px-3 text-[var(--color-text-primary)] placeholder:text-gray-400 text-[15px]"
            autoFocus
          />
          <div className="flex items-center gap-2 shrink-0 text-gray-400">
            <button className="p-1 hover:bg-[var(--color-surface-raised)] rounded text-[#2783de]">
              <ViewIcon />
            </button>
            <button className="p-1 hover:bg-[var(--color-surface-raised)] rounded text-[#2783de]">
              <FilterListIcon />
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-50 text-[13px] text-[var(--color-text-secondary)]">
          <button className="hover:text-gray-700 flex items-center gap-1.5">
            <span className="font-serif italic">Aa</span> Title only
          </button>
          <button className="hover:text-gray-700 flex items-center gap-1.5">
            <UserIcon /> Created by <ChevronDownIcon />
          </button>
          <button className="hover:text-gray-700 flex items-center gap-1.5">
            <InIcon /> In <ChevronDownIcon />
          </button>
          <button className="hover:text-gray-700 flex items-center gap-1.5 ml-2">
            + Filter
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[var(--color-surface-muted)] p-4">
          {/* Empty state or search results go here */}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-surface-raised)] text-[11px] text-gray-400 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><kbd className="font-sans">⌘</kbd> <kbd className="font-sans">↵</kbd> Open in new tab</span>
          </div>
          <div className="flex items-center gap-1">
            <SettingsIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="3" x2="9" y2="21"></line>
    </svg>
  );
}

function FilterListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"></line>
      <line x1="4" y1="10" x2="4" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="3"></line>
      <line x1="20" y1="21" x2="20" y2="16"></line>
      <line x1="20" y1="12" x2="20" y2="3"></line>
      <line x1="1" y1="14" x2="7" y2="14"></line>
      <line x1="9" y1="8" x2="15" y2="8"></line>
      <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function InIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"></line>
      <line x1="4" y1="10" x2="4" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="3"></line>
      <line x1="20" y1="21" x2="20" y2="16"></line>
      <line x1="20" y1="12" x2="20" y2="3"></line>
      <line x1="1" y1="14" x2="7" y2="14"></line>
      <line x1="9" y1="8" x2="15" y2="8"></line>
      <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
  );
}
