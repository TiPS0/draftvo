"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
