import { redirect } from "next/navigation";
import { validateSession } from "@/src/server/session";
import { Sidebar } from "@/src/ui/Sidebar";
import { BottomNav } from "@/src/ui/BottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await validateSession();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100">
      {/* Sidebar for Desktop / Tablet */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
}
