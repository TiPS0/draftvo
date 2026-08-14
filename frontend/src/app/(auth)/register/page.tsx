"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "../_components/AuthForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Full name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error ?? "Registration failed. Try again." });
        return;
      }

      setSuccess(true);
      setTimeout(() => router.replace("/login?registered=1"), 800);
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Create your account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--color-surface-strong)] font-[500] hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      {success ? (
        <SuccessBanner />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {errors.form && (
            <div
              role="alert"
              className="px-3 py-2.5 rounded-[var(--radius-xs)] bg-[rgba(217,78,63,0.08)] border border-[rgba(217,78,63,0.2)] text-[var(--font-size-sm)] text-[#d94e3f]"
            >
              {errors.form}
            </div>
          )}

          <Input
            label="Full name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            disabled={loading}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            disabled={loading}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
          />

          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-1"
            id="register-submit"
          >
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      )}
    </AuthForm>
  );
}

function SuccessBanner() {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="w-10 h-10 rounded-full bg-[rgba(39,131,222,0.1)] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M4 10l4 4 8-8"
            stroke="#2783de"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
        Account created! Redirecting to login…
      </p>
    </div>
  );
}
