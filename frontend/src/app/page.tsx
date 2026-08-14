import { cookies } from "next/headers";
import { verifyJwt, SESSION_COOKIE } from "@/lib/auth";
import { Sidebar } from "./_components/Sidebar";
import { TaskBoard } from "./_components/TaskBoard";

export default async function HomePage() {
  // Read session for user identity (middleware already ensures auth)
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  const payload = token ? await verifyJwt(token) : null;

  const userName = payload?.name ?? "User";
  const userEmail = payload?.sub ?? "";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePath="/" userName={userName} userEmail={userEmail} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[var(--background)]">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-8 bg-[var(--background)] border-b border-[rgba(42,28,0,0.08)]">
          <h1 className="text-[var(--font-size-md)] font-[600] text-[var(--color-text-primary)]">
            My Tasks
          </h1>
          <div className="flex items-center gap-2 text-[var(--font-size-xs)] text-[var(--color-text-tertiary)]">
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-8">
          <TaskBoard />
        </div>
      </main>
    </div>
  );
}
