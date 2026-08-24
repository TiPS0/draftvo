"use client";

import React from "react";

interface AuthFormProps {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthForm({ title, subtitle, children }: AuthFormProps) {
  return (
    <div
      className="w-full max-w-[400px] bg-[var(--color-surface-muted)] rounded-[var(--radius-sm)] p-8"
      style={{ boxShadow: "var(--shadow-1)" }}
    >


      {/* Heading */}
      <h1 className="text-[var(--font-size-lg)] font-[600] text-[var(--color-text-primary)] leading-7 mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)] mb-6">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}


