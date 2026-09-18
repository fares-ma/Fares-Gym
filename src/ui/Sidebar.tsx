"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Dumbbell,
  Apple,
  Calendar,
  TrendingUp,
  Settings,
  History,
  LogOut,
} from "lucide-react";
import { logoutAction } from "../server/auth";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "../lib/utils";
import { ar } from "../i18n/ar";

const NAV_GROUPS = [
  {
    title: "TODAY",
    items: [{ href: "/", label: ar.nav.today, icon: Home }],
  },
  {
    title: "FITNESS",
    items: [
      { href: "/workout", label: ar.nav.workout, icon: Dumbbell },
      { href: "/workout/history", label: ar.nav.workoutHistory, icon: History },
    ],
  },
  {
    title: "LIFE",
    items: [
      { href: "/nutrition", label: ar.nav.nutrition, icon: Apple },
      { href: "/activities", label: ar.nav.activities, icon: Calendar },
    ],
  },
  {
    title: "DATA",
    items: [
      { href: "/progress", label: ar.nav.progress, icon: TrendingUp },
      { href: "/settings", label: ar.nav.settings, icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-e border-[#2B252E] bg-[#18151B] h-screen sticky top-0 p-4 justify-between z-30 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-[#2B252E] pb-4">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#D6AA63]/60 shadow-md shrink-0 bg-[#211C23] relative">
            <Image
              src="/character/avatar.png"
              alt="Mini Fares"
              width={44}
              height={44}
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div>
            <h1 className="font-black text-sm text-[#F2EADF] tracking-wider uppercase font-mono">
              FARES HUB
            </h1>
            <p className="text-[10px] text-[#D6AA63] font-mono tracking-tight">
              Discipline Builds Freedom
            </p>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-black text-[#9D969D]/80 tracking-widest font-mono uppercase">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs transition-all duration-150",
                      isActive
                        ? "bg-[#7C1D38] text-[#F2EADF] shadow-sm shadow-[#7C1D38]/30"
                        : "text-[#9D969D] hover:text-[#F2EADF] hover:bg-[#211C23]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-[#F2EADF]" : "text-[#9D969D]"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Controls */}
      <div className="border-t border-[#2B252E] pt-4 space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] text-[#9D969D] font-bold">{ar.nav.theme}</span>
          <ThemeToggle />
        </div>

        <button
          onClick={async () => {
            await logoutAction();
            window.location.href = "/login";
          }}
          type="button"
          className="flex w-full items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{ar.auth.logout}</span>
        </button>
      </div>
    </aside>
  );
}
