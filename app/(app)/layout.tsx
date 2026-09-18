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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0F0D11] text-[#F2EADF] selection:bg-[#7C1D38] selection:text-[#F2EADF]">
      {/* Sidebar for Desktop / Tablet */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto p-3 sm:p-5 lg:p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
}
