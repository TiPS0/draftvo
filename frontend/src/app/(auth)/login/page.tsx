"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "../_components/AuthForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastLoginEmail = localStorage.getItem("lastLoginEmail");
    if (lastLoginEmail) {
      setValues((prev) => ({ ...prev, email: lastLoginEmail }));
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error ?? "Invalid email or password." });
        return;
      }

      localStorage.setItem("lastLoginEmail", values.email);

      router.replace("/");
      router.refresh();
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle={
        <>
          No account yet?{" "}
          <Link
            href="/register"
            className="text-[var(--color-surface-strong)] font-[500] hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      {justRegistered && (
        <div
          role="status"
          className="mb-5 px-3 py-2.5 rounded-[var(--radius-xs)] bg-[rgba(39,131,222,0.08)] border border-[rgba(39,131,222,0.2)] text-[var(--font-size-sm)] text-[var(--color-surface-strong)]"
        >
          Account created — sign in to get started.
        </div>
      )}

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
          autoComplete="current-password"
          placeholder="Your password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mt-1"
          id="login-submit"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthForm>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
