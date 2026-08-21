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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

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

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 animate-in fade-in duration-200">
          <div
            className="bg-[var(--color-surface-muted)] p-5 shadow-xl w-full max-w-[324px] mx-6 border flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
            style={{ borderRadius: '12px', borderColor: 'var(--color-surface-raised)' }}
          >

            <div className="flex items-center justify-center gap-2 font-semibold text-[18px] text-[var(--color-text-primary)] mb-1.5">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="w-5 h-5 text-red-500" fill="currentColor">
                <path d="M2.375 10a7.625 7.625 0 1 1 5.992 7.45c.151-.456.233-.944.233-1.45a4.58 4.58 0 0 0-.966-2.82A4.8 4.8 0 0 1 10 12.561c1.754 0 3.298.934 4.087 2.332A6.375 6.375 0 1 0 3.78 11.406q-.643.032-1.23.227A7.7 7.7 0 0 1 2.375 10"></path>
                <path d="M4 12.5a3.5 3.5 0 0 0-1.137.189A3.502 3.502 0 0 0 4 19.5a3.5 3.5 0 1 0 0-7m.031.906c.345 0 .625.28.625.625v2a.625.625 0 1 1-1.25 0v-2c0-.345.28-.625.625-.625m-.625 4.471a.625.625 0 1 1 1.25-.004.625.625 0 0 1-1.25.004M10 5.125c-.95 0-1.723.393-2.245 1.044-.51.635-.75 1.474-.75 2.346s.24 1.71.75 2.346c.522.65 1.295 1.044 2.245 1.044s1.723-.394 2.245-1.044c.51-.635.75-1.474.75-2.346s-.24-1.711-.75-2.346c-.522-.65-1.294-1.044-2.245-1.044"></path>
              </svg>
              <span>Log out of your account?</span>
            </div>

            <div className="text-[var(--color-text-secondary)] text-[14px] mb-4">
              You will need to log back in to access your workspaces.
            </div>

            <div className="flex flex-col w-full gap-2">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-2 bg-[#eb5757] hover:bg-[#d64c4c] text-white text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
                style={{ borderRadius: '6px' }}
              >
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="w-full py-2 border text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5 text-[14px] font-medium transition-colors"
                style={{ borderRadius: '6px', borderColor: 'var(--color-surface-raised)' }}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal */}
      <div className="relative flex w-full max-w-[1050px] h-[720px] max-h-[90vh] bg-[var(--color-surface-muted)] rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Left Sidebar */}
        <div className="w-[240px] shrink-0 bg-background border-r border-[var(--color-surface-raised)] flex flex-col">
          <div className="flex-1 overflow-y-auto py-3 flex flex-col">

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
              <NavItem icon={<HardDriveIcon />} label="Storage" id="storage" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<UsersIcon />} label="People" id="people" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<DownloadIcon />} label="Import" id="import" activeTab={activeTab} onClick={setActiveTab} />
            </div>

            <div className="mb-6">
              <div className="px-4 mb-1 text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Features</div>
              <NavItem icon={<LinkIcon />} label="Connections" id="connections" activeTab={activeTab} onClick={setActiveTab} />
              <NavItem icon={<BoxIcon />} label="MCP" id="mcp" activeTab={activeTab} onClick={setActiveTab} />
            </div>

            <div className="mt-auto mb-6 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-2 px-4 py-1.5 text-[14px] text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <LogoutIcon />
                </div>
                <span className="truncate">Log out</span>
              </button>
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
                <p className="text-[14px] text-[var(--color-text-secondary)] pb-6">Choose how you want Draftvo to look and behave</p>

                {/* Appearance */}
                <div className="mb-8 border-b border-[var(--color-surface-raised)] pb-8">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">Appearance</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Theme</div>
                      <div className="text-[13px] text-[var(--color-text-secondary)]">Choose a theme for Draftvo on this device</div>
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
                      <div className="text-[13px] text-[var(--color-text-secondary)]">Choose the language you want to use Draftvo in</div>
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
            ) : activeTab === 'storage' ? (
              <StorageView />
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

let cachedStorageData: { usage: number, quota: number } | null = null;

function StorageView() {
  const [usage, setUsage] = useState(cachedStorageData ? cachedStorageData.usage : 0);
  const [quota, setQuota] = useState(cachedStorageData ? cachedStorageData.quota : 200 * 1024 * 1024 * 1024); // default mock 200GB
  const [limitMB, setLimitMB] = useState(1024);
  const [folderPath, setFolderPath] = useState("./data");
  const [isCalculating, setIsCalculating] = useState(!cachedStorageData);
  const [skeletonWidth, setSkeletonWidth] = useState(0);

  useEffect(() => {
    if (isCalculating) {
      // Trigger animation from 0% to 20%
      requestAnimationFrame(() => setSkeletonWidth(20));

      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then((est) => {
          if (est.usage) setUsage(est.usage);
          if (est.quota) {
            setQuota(est.quota);
            setLimitMB(Math.min(1024, Math.floor(est.quota / (1024 ** 2))));
          }
          cachedStorageData = { usage: est.usage || 0, quota: est.quota || 0 };
          setTimeout(() => setIsCalculating(false), 800);
        });
      } else {
        setTimeout(() => setIsCalculating(false), 800);
      }
    }
  }, [isCalculating]);

  const handleSelectFolder = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        // @ts-ignore
        const dirHandle = await window.showDirectoryPicker();
        setFolderPath(dirHandle.name);
      } else {
        alert("Your browser does not support the Directory Picker API. Please type the path manually.");
      }
    } catch (err) {
      console.log("Folder selection cancelled", err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 GB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const limitBytes = limitMB * 1024 * 1024;
  const effectiveQuota = Math.min(quota, limitBytes);

  // Calculate visual percentages (scale mock usage so free space is always correctly shown relative to limit)
  const visualUsage = usage > (10 * 1024 * 1024) ? usage : Math.min(effectiveQuota * 0.15, 1.5 * 1024 * 1024 * 1024);
  const draftsBytes = visualUsage * 0.75;
  const otherBytes = visualUsage * 0.25;
  const freeBytes = Math.max(0, effectiveQuota - visualUsage);

  const draftsPct = Math.min(100, (draftsBytes / effectiveQuota) * 100);
  const otherPct = Math.min(100, (otherBytes / effectiveQuota) * 100);

  return (
    <div className="max-w-[700px]">
      <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] mb-1">Storage Manager</h1>
      <p className="text-[14px] text-[var(--color-text-secondary)] pb-6">Manage how and where your data is stored</p>

      {/* Storage Usage Bar */}
      <div className="mb-8 border-b border-[var(--color-surface-raised)] pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            Storage Usage <span className="text-red-500 font-normal text-[11px] ml-2">*mockup data</span>
          </h3>
          <div className="text-[12px] text-[var(--color-text-secondary)] font-medium tracking-wide">
            {isCalculating ? (
              <span className="animate-pulse">Calculating...</span>
            ) : (
              <>{formatBytes(visualUsage)} of {formatBytes(effectiveQuota)} Used</>
            )}
          </div>
        </div>

        <div className="w-full h-6 bg-gray-100 dark:bg-[var(--color-surface-raised)] border border-gray-200 dark:border-none shadow-sm dark:shadow-none rounded-[6px] overflow-hidden flex mb-3">
          {isCalculating ? (
            <div className="h-full bg-[#7D7D7D] transition-all duration-700 ease-out" style={{ width: `${skeletonWidth}%` }}></div>
          ) : (
            <>
              <div className="h-full bg-[#2783de] transition-all duration-500 border-r border-black/10 dark:border-black/30" style={{ width: `${draftsPct}%` }}></div>
              <div className="h-full bg-[#ea9b25] transition-all duration-500 border-r border-black/10 dark:border-black/30" style={{ width: `${otherPct}%` }}></div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] min-h-[16px]">
          {isCalculating ? (
            <div className="flex items-center gap-1.5 animate-pulse text-[#7D7D7D]">
              <div className="w-2 h-2 rounded-full bg-[#7D7D7D]"></div> Calculate...
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2783de]"></div> Drafts {formatBytes(draftsBytes)}</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ea9b25]"></div> Other {formatBytes(otherBytes)}</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-[var(--color-surface-raised)]"></div> Free {formatBytes(freeBytes)}</div>
            </>
          )}
        </div>
      </div>

      {/* Storage Limit */}
      <div className="mb-8 border-b border-[var(--color-surface-raised)] pb-8">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">Project Storage Limit</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Maximum Storage</div>
            <div className="text-[13px] text-[var(--color-text-secondary)] max-w-[450px]">Restrict how much of your device's total storage this project can use (in MB).</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <input
              type="number"
              min="100"
              max={Math.floor(quota / (1024 ** 2))}
              value={limitMB}
              onChange={(e) => setLimitMB(parseInt(e.target.value) || 0)}
              className="border border-[var(--color-surface-raised)] rounded text-[13px] px-3 py-1.5 outline-none focus:border-[#2783de] bg-[var(--color-surface-muted)] w-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Storage Location Settings */}
      <div className="mb-8 pb-8">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-4">Storage Location</h3>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Local Folder Path</div>
            <div className="text-[13px] text-[var(--color-text-secondary)] max-w-[450px]">Select the directory on your device where data will be stored.</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="border border-[var(--color-surface-raised)] rounded text-[13px] px-2 py-1 outline-none focus:border-[#2783de] bg-[var(--color-surface-muted)] w-[180px]"
              placeholder="/path/to/folder"
            />
            <button
              onClick={handleSelectFolder}
              className="px-3 py-1 bg-[var(--color-surface-raised)] hover:bg-black/10 rounded text-[13px] font-medium transition-colors"
            >
              Browse
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between opacity-50 pointer-events-none">
          <div>
            <div className="text-[14px] font-medium text-[var(--color-text-primary)]">Sync Data to Cloud</div>
            <div className="text-[13px] text-[var(--color-text-secondary)] max-w-[450px]">Store tasks across multiple devices by syncing to the cloud in the background.</div>
          </div>
          <div className="w-8 h-4 bg-[var(--color-surface-raised)] rounded-full relative cursor-not-allowed opacity-50">
            <div className="w-4 h-4 bg-[var(--color-surface-muted)] rounded-full border border-[var(--color-surface-raised)] shadow-sm absolute left-0"></div>
          </div>
        </div>
      </div>
    </div>
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
function HardDriveIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>; }
function LogoutIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>; }
