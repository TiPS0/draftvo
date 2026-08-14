import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-surface-strong)] text-white",
    "hover:bg-[#1e6fc4]",
    "active:bg-[#1a5fa8]",
    "disabled:bg-[#b3cde8] disabled:cursor-not-allowed",
  ].join(" "),
  secondary: [
    "bg-transparent text-[var(--color-text-primary)] border border-[rgba(42,28,0,0.12)]",
    "hover:bg-[rgba(42,28,0,0.04)] hover:border-[rgba(42,28,0,0.18)]",
    "active:bg-[rgba(42,28,0,0.08)]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--color-text-secondary)]",
    "hover:text-[var(--color-text-primary)] hover:bg-[rgba(42,28,0,0.04)]",
    "active:bg-[rgba(42,28,0,0.08)]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-[var(--font-size-sm)] gap-1.5",
  md: "h-10 px-5 text-[var(--font-size-md)] gap-2",
  lg: "h-12 px-6 text-[var(--font-size-md)] gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={[
        "inline-flex items-center justify-center font-[500] rounded-[var(--radius-md)]",
        "transition-all duration-[var(--motion-normal)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-surface-strong)] focus-visible:outline-offset-2",
        "select-none cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
