"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "./Skeleton";

export function RealTimeClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    // Return skeleton block during SSR to avoid hydration mismatch
    return <Skeleton className="w-56 h-4" />;
  }

  return (
    <span suppressHydrationWarning>
      {time.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })}
    </span>
  );
}
