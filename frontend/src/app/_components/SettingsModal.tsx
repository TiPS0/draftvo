"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export function SettingsModal({ isOpen, onClose, userName = "You" }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("preferences");
  const [autoTimeZone, setAutoTimeZone] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative flex w-full max-w-[1050px] h-[720px] max-h-[90vh] bg-[var(--color-surface-muted)] rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Left Sidebar */}
        <div className="w-[240px] shrink-0 bg-background border-r border-[var(--color-surface-raised)] flex flex-col">
          <div className="flex-1 overflow-y-auto py-3">

            <div className="mb-6">
              <div className="px-4 mb-1 text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Account</div>
              <NavItem icon={<AvatarIcon />} label={userName} id="profile" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<SettingsIcon />} label="Preferences" id="preferences" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<BellIcon />} label="Notifications" id="notifications" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<MailIcon />} label="Mail & Calendar" id="mail" activeTab={activeTab} onClick={setActiveTab} />
            </div>

            <div className="mb-6">
              <div className="px-4 mb-1 text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Workspace</div>
              <NavItem icon={<SettingsIcon />} label="General" id="general" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<UsersIcon />} label="People" id="people" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<DownloadIcon />} label="Import" id="import" activeTab={activeTab} onClick={setActiveTab} />
            </div>

            <div className="mb-6">
              <div className="px-4 mb-1 text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Features</div>
              <NavItem icon={<LinkIcon />} label="Connections" id="connections" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<BoxIcon />} label="MCP" id="mcp" activeTab={activeTab} onClick={setActiveTab} />
            </div>

          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[var(--color-surface-muted)] flex flex-col">
          <div className="h-12 flex items-center justify-end px-4 border-b border-transparent shrink-0">
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[var(--color-surface-raised)] text-gray-400 hover:text-[var(--color-text-secondary)] transition-colors">
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-10 md:px-16 pb-16">
            {activeTab === 'preferences' ? (
              <div className="max-w-[700px]">
                <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] mb-1">Preferences</h1>
                <p className="text-[14px] text-[var(--color-text-secondary)] mb-10 border-b border-[var(--color-surface-raised)] pb-6">Choose how you want Draftation to look and behave</p>

                {/* Appearance */}
                <div className="mb-8 border-b border-[var(--color-surface-raised)] pb-8">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">Appearance</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Theme</div>
                      <div className="text-[13px] text-[var(--color-text-secondary)]">Choose a theme for Draftation on this device</div>
                    </div>
                    <select 
                      className="border border-[var(--color-surface-raised)] rounded text-[13px] px-2 py-1 outline-none focus:border-gray-300 bg-[var(--color-surface-muted)]"
                      value={mounted ? theme : "system"}
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System setting</option>
                    </select>
                  </div>
                </div>

                {/* Input options */}
                <div className="mb-8 border-b border-[var(--color-surface-raised)] pb-8">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">Input options</h3>

                  <div className="flex items-center justify-between">
                    <div className="opacity-50">
                      <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Use Enter to add a new line</div>
                      <div className="text-[13px] text-[var(--color-text-secondary)]">Applies to chat, comments, and other input fields. Press <strong className="font-semibold text-gray-700">Cmd/Ctrl + Enter</strong> to send.</div>
                    </div>
                    <div className="w-8 h-4 bg-[var(--color-surface-raised)] rounded-full relative cursor-not-allowed opacity-50">
                      <div className="w-4 h-4 bg-[var(--color-surface-muted)] rounded-full border border-[var(--color-surface-raised)] shadow-sm absolute left-0"></div>
                    </div>
                  </div>
                </div>

                {/* Language & time */}
                <div className="mb-8 pb-8">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">Language & time</h3>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Language</div>
                      <div className="text-[13px] text-[var(--color-text-secondary)]">Choose the language you want to use Draftation in</div>
                    </div>
                    <select className="border border-[var(--color-surface-raised)] rounded text-[13px] px-2 py-1 outline-none focus:border-gray-300">
                      <option>English (US)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Set time zone automatically using your location</div>
                      <div className="text-[13px] text-[var(--color-text-secondary)] max-w-[450px]">Reminders, notifications, and emails will be delivered to you based on your time zone</div>
                    </div>
                    <div 
                      className={`w-8 h-4 rounded-full relative cursor-pointer shrink-0 transition-colors ${autoTimeZone ? 'bg-[#2783de]' : 'bg-[var(--color-surface-raised)]'}`}
                      onClick={() => setAutoTimeZone(!autoTimeZone)}
                    >
                      <div className={`w-4 h-4 bg-[var(--color-surface-muted)] rounded-full border shadow-sm absolute top-0 transition-transform ${autoTimeZone ? 'translate-x-4 border-[#2783de]' : 'left-0 border-[var(--color-surface-raised)]'}`}></div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between ${autoTimeZone ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div>
                      <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Time zone</div>
                      <div className="text-[13px] text-[var(--color-text-secondary)]">Choose your time zone</div>
                    </div>
                    <select className="border border-[var(--color-surface-raised)] rounded text-[13px] px-2 py-1 outline-none focus:border-gray-300 bg-[var(--color-surface-muted)]" disabled={autoTimeZone}>
                      <option>(GMT+7:00) Bangkok</option>
                    </select>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Content for {activeTab}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function NavItem({ icon, label, id, activeTab, onClick }: { icon: React.ReactNode, label: string, id: string, activeTab: string, onClick: (id: string) => void }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-2 px-4 py-1.5 text-[14px] transition-colors ${isActive ? 'bg-black/5 font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-black/5'}`}
    >
      <div className={`w-4 h-4 flex items-center justify-center ${isActive ? 'text-[var(--color-text-primary)]' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
}

// Minimal Icons for Settings Nav
function AvatarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>; }
function SettingsIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>; }
function BellIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>; }
function MailIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>; }
function UsersIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>; }
function DownloadIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>; }
function SparklesIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>; }
function LinkIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>; }
function BoxIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>; }
function GlobeIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>; }
function SmileIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>; }
function CodeIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>; }
function BuildingIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>; }
function ArrowUpCircleIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>; }
function CloseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>; }
