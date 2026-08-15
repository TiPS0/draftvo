import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div 
      className={`skeleton-wave rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}
