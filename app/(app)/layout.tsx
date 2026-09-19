import { redirect } from "next/navigation";
import { validateSession } from "@/server/session";
import { Sidebar } from "@/ui/Sidebar";
import { BottomNav } from "@/ui/BottomNav";

export const dynamic = "force-dynamic";

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0D0C0F] text-[#F1E9DD] selection:bg-[#7A1735] selection:text-[#F1E9DD] relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(122,23,53,0.18),transparent_70%)] pointer-events-none z-0" />

      {/* Sidebar for Desktop / Tablet */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8 relative z-10">
        <div className="max-w-5xl mx-auto p-3 sm:p-5 lg:p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
}
