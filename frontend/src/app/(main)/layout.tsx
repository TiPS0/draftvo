import { cookies } from "next/headers";
import { verifyJwt, SESSION_COOKIE } from "@/lib/auth";
import { AppLayout } from "../_components/AppLayout";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  const payload = token ? await verifyJwt(token) : null;

  if (!payload) {
    redirect("/login");
  }

  const userName = payload.name ?? "User";
  const userEmail = payload.sub ?? "";

  return (
    <AppLayout userName={userName} userEmail={userEmail}>
      {children}
    </AppLayout>
  );
}
