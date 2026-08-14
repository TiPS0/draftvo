import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className = "",
  ...rest
}: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const hasDescription = Boolean(error || hint);
  const describedBy = [error && errorId, hint && hintId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-[var(--space-5)]">
      <label
        htmlFor={id}
        className="text-[var(--font-size-sm)] font-[500] text-[var(--color-text-primary)] leading-5"
      >
        {label}
      </label>

      <input
        id={id}
        aria-describedby={hasDescription ? describedBy : undefined}
        aria-invalid={error ? "true" : undefined}
        className={[
          "w-full h-10 px-3 rounded-[var(--radius-xs)]",
          "bg-white text-[var(--color-text-primary)] text-[var(--font-size-md)]",
          "border transition-all duration-[var(--motion-normal)]",
          error
            ? "border-[#d94e3f] focus:border-[#d94e3f] focus:ring-2 focus:ring-[rgba(217,78,63,0.2)]"
            : "border-[rgba(42,28,0,0.12)] hover:border-[rgba(42,28,0,0.24)] focus:border-[var(--color-surface-strong)] focus:ring-2 focus:ring-[rgba(39,131,222,0.15)]",
          "outline-none",
          "placeholder:text-[var(--color-text-tertiary)]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background)]",
          className,
        ].join(" ")}
        {...rest}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-[var(--font-size-xs)] text-[#d94e3f] leading-4"
        >
          {error}
        </p>
      )}
      {!error && hint && (
        <p
          id={hintId}
          className="text-[var(--font-size-xs)] text-[var(--color-text-tertiary)] leading-4"
        >
          {hint}
        </p>
      )}
    </div>
  );
}
