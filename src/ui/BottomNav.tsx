"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Apple, Calendar, Menu } from "lucide-react";
import { ar } from "../i18n/ar";
import { cn } from "../lib/utils";
import { useState } from "react";

const MOBILE_ITEMS = [
  { href: "/", label: ar.nav.today, icon: Home },
  { href: "/workout", label: ar.nav.workout, icon: Dumbbell },
  { href: "/nutrition", label: ar.nav.nutrition, icon: Apple },
  { href: "/activities", label: ar.nav.activities, icon: Calendar },
];

export function BottomNav() {
  const pathname = usePathname();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const isMoreActive =
    pathname === "/progress" ||
    pathname === "/settings" ||
    pathname.startsWith("/workout/history");

  return (
    <>
      {/* Popover for "More" menu */}
      {moreMenuOpen && (
        <div
          onClick={() => setMoreMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden flex flex-col justify-end p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="comic-card p-4 mb-16 space-y-2 border border-[#7C1D38]/50 shadow-2xl animate-breathe"
          >
            <div className="text-xs font-black text-[#D6AA63] tracking-widest uppercase mb-2">
              {ar.nav.morePages}
            </div>
            <Link
              href="/workout/history"
              onClick={() => setMoreMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#211C23] text-sm font-bold text-[#F2EADF]"
            >
              <span>📜</span>
              <span>{ar.nav.workoutHistory}</span>
            </Link>
            <Link
              href="/progress"
              onClick={() => setMoreMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#211C23] text-sm font-bold text-[#F2EADF]"
            >
              <span>📈</span>
              <span>{ar.nav.progress}</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setMoreMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#211C23] text-sm font-bold text-[#F2EADF]"
            >
              <span>⚙️</span>
              <span>{ar.nav.settings}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#18151B] border-t border-[#2B252E] z-40 py-1 px-2 shadow-2xl">
        <div className="flex items-center justify-around">
          {MOBILE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 relative min-w-[56px]",
                  isActive ? "text-[#F2EADF]" : "text-[#9D969D] hover:text-[#F2EADF]"
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-lg transition-transform",
                    isActive ? "text-[#7C1D38] scale-110" : ""
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] tracking-tight font-bold",
                    isActive ? "text-[#7C1D38]" : ""
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-4 h-1 rounded-full bg-[#7C1D38] mt-0.5" />
                )}
              </Link>
            );
          })}

          {/* More Button */}
          <button
            type="button"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 relative min-w-[56px] cursor-pointer",
              isMoreActive || moreMenuOpen
                ? "text-[#7C1D38]"
                : "text-[#9D969D] hover:text-[#F2EADF]"
            )}
          >
            <div className="p-1">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight font-bold">{ar.nav.more}</span>
            {(isMoreActive || moreMenuOpen) && (
              <div className="w-4 h-1 rounded-full bg-[#7C1D38] mt-0.5" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
