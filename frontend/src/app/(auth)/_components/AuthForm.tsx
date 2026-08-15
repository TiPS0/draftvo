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
      {/* Logo mark */}
      <div className="flex items-center gap-2 mb-8">
        <DraftvoLogo />
        <span className="text-[var(--font-size-md)] font-[600] text-[var(--color-text-primary)] tracking-tight">
          Draftvo
        </span>
      </div>

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

function DraftvoLogo() {
  return (
    <svg
      width="28"
      height="28"
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
