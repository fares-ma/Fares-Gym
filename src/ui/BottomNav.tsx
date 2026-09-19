"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Apple, Calendar, Menu, History, TrendingUp, Settings } from "lucide-react";
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
      {/* Backdrop & Popover for "More" menu */}
      {moreMenuOpen && (
        <div
          onClick={() => setMoreMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 md:hidden flex flex-col justify-end p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="hub-card-elevated p-4 mb-20 space-y-2 border border-[#2A242E] shadow-2xl rounded-2xl animate-in slide-in-from-bottom-4 duration-200"
          >
            <div className="text-xs font-black text-[#C9A15A] tracking-wider uppercase mb-3 px-2 flex items-center justify-between">
              <span>{ar.nav.morePages}</span>
              <span className="text-[10px] text-[#A7A0A6] font-latin">Fares Hub</span>
            </div>
            <Link
              href="/workout/history"
              onClick={() => setMoreMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-sm",
                pathname.startsWith("/workout/history")
                  ? "bg-[#7A1735] text-[#F1E9DD] shadow-sm shadow-[#7A1735]/40"
                  : "text-[#F1E9DD] hover:bg-[#26202A]"
              )}
            >
              <History className="w-5 h-5 text-[#C9A15A]" />
              <span>{ar.nav.workoutHistory}</span>
            </Link>
            <Link
              href="/progress"
              onClick={() => setMoreMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-sm",
                pathname === "/progress"
                  ? "bg-[#7A1735] text-[#F1E9DD] shadow-sm shadow-[#7A1735]/40"
                  : "text-[#F1E9DD] hover:bg-[#26202A]"
              )}
            >
              <TrendingUp className="w-5 h-5 text-[#C9A15A]" />
              <span>{ar.nav.progress}</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setMoreMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-sm",
                pathname === "/settings"
                  ? "bg-[#7A1735] text-[#F1E9DD] shadow-sm shadow-[#7A1735]/40"
                  : "text-[#F1E9DD] hover:bg-[#26202A]"
              )}
            >
              <Settings className="w-5 h-5 text-[#C9A15A]" />
              <span>{ar.nav.settings}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Bottom Nav Bar */}
      <nav
        aria-label={ar.nav.ariaMobileNav}
        className="md:hidden fixed bottom-0 inset-x-0 bg-[#151318]/95 backdrop-blur-md border-t border-[#2A242E] z-40 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] px-3 shadow-2xl"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {MOBILE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 relative min-w-[56px] min-h-[48px]",
                  isActive ? "text-[#F1E9DD]" : "text-[#A7A0A6] hover:text-[#F1E9DD]"
                )}
              >
                <div
                  className={cn(
                    "p-1 rounded-lg transition-transform duration-150",
                    isActive ? "text-[#A83252] scale-110" : ""
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "text-[10px] tracking-tight font-bold transition-colors",
                    isActive ? "text-[#F1E9DD]" : "text-[#A7A0A6]"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-3.5 h-1 rounded-full bg-[#7A1735] mt-0.5 shadow-xs shadow-[#7A1735]" />
                )}
              </Link>
            );
          })}

          {/* More Button */}
          <button
            type="button"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 relative min-w-[56px] min-h-[48px] cursor-pointer",
              isMoreActive || moreMenuOpen
                ? "text-[#F1E9DD]"
                : "text-[#A7A0A6] hover:text-[#F1E9DD]"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-lg transition-transform duration-150",
                isMoreActive || moreMenuOpen ? "text-[#A83252] scale-110" : ""
              )}
            >
              <Menu className="w-5 h-5" />
            </div>
            <span
              className={cn(
                "text-[10px] tracking-tight font-bold transition-colors",
                isMoreActive || moreMenuOpen ? "text-[#F1E9DD]" : "text-[#A7A0A6]"
              )}
            >
              {ar.nav.more}
            </span>
            {(isMoreActive || moreMenuOpen) && (
              <div className="w-3.5 h-1 rounded-full bg-[#7A1735] mt-0.5 shadow-xs shadow-[#7A1735]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
