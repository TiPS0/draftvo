"use client";

import { AppLayout } from "../_components/AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";

  if (!mounted) {
    return null;
  }

  return (
    <AuthGuard>
      <AppLayout userName={userName} userEmail={userEmail}>
        {children}
      </AppLayout>
    </AuthGuard>
  );
}
