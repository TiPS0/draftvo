import React from "react";
import { AuthHeader } from "./_components/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 relative">
      <AuthHeader />
      {children}
    </div>
  );
}


