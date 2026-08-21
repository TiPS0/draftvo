"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export function AppLayout({ children, userName = "You", userEmail = "" }: AppLayoutProps) {
  const [width, setWidth] = useState(250);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringDrag, setIsHoveringDrag] = useState(false);
  const [mouseY, setMouseY] = useState(0);
  const pathname = usePathname();
  
  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedWidth) setWidth(Number(savedWidth));
    if (savedCollapsed) setIsCollapsed(savedCollapsed === "true");
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMoveDrag = (e: React.MouseEvent) => {
    setMouseY(e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = e.clientX;
      if (newWidth < 250) newWidth = 250;
      if (newWidth > 400) newWidth = 400;
      setWidth(newWidth);
      setMouseY(e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem("sidebarWidth", width.toString());
    }
  }, [width, isDragging]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString());
  }, [isCollapsed]);

  // --- bfcache defence-in-depth ---
  // When the browser restores this page from the Back-Forward Cache
  // (e.g. macOS 2-finger swipe-back after logout), `event.persisted` is
  // true. At that point the session cookie is already gone, so we
  // re-validate with the server and redirect to /login if needed.
  useEffect(() => {
    const handlePageShow = async (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          window.location.replace("/login");
        }
      } catch {
        // Network error — conservatively redirect to login
        window.location.replace("/login");
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div 
        style={{ width: isCollapsed ? 0 : width }} 
        className={`shrink-0 relative group ${!isDragging ? 'transition-[width] duration-300 ease-in-out' : ''} ${isCollapsed ? 'overflow-hidden' : ''}`}
      >
        <div style={{ width: width }} className="h-full">
          <Sidebar 
            activePath={pathname} 
            userName={userName} 
            userEmail={userEmail} 
            onCollapse={() => setIsCollapsed(true)} 
          />
        </div>
        
        {/* Drag Handle */}
        {!isCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHoveringDrag(true)}
            onMouseLeave={() => setIsHoveringDrag(false)}
            onMouseMove={handleMouseMoveDrag}
            className="absolute top-0 right-0 w-[6px] h-full cursor-col-resize z-50 transition-shadow hover:shadow-[-1px_0_0_0_rgba(42,28,0,0.15)_inset]"
          >
            {/* Tooltip following mouse */}
            <div 
              style={{ top: mouseY, transform: 'translateY(-50%)' }}
              className={`fixed left-[${width + 8}px] transition-opacity duration-200 bg-[#2f2f2f] text-[#d4d4d4] text-[12px] font-[500] py-1 px-2.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-[60] ${
                isHoveringDrag || isDragging ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Resize Drag
            </div>
          </div>
        )}
      </div>
      
      <main className="flex-1 overflow-y-auto bg-[var(--color-surface-muted)] relative flex flex-col min-w-0">
        {isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="absolute top-2 left-4 z-[60] p-1.5 rounded hover:bg-black/5 text-[var(--color-text-secondary)]"
            aria-label="Expand Sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
