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
import { cn } from "../lib/utils";
import { ar } from "../i18n/ar";

const NAV_GROUPS = [
  {
    title: ar.nav.groups.today,
    items: [{ href: "/", label: ar.nav.today, icon: Home, exact: true }],
  },
  {
    title: ar.nav.groups.fitness,
    items: [
      { href: "/workout", label: ar.nav.workout, icon: Dumbbell, exact: true },
      { href: "/workout/history", label: ar.nav.workoutHistory, icon: History, exact: false },
    ],
  },
  {
    title: ar.nav.groups.life,
    items: [
      { href: "/nutrition", label: ar.nav.nutrition, icon: Apple, exact: false },
      { href: "/activities", label: ar.nav.activities, icon: Calendar, exact: false },
    ],
  },
  {
    title: ar.nav.groups.data,
    items: [
      { href: "/progress", label: ar.nav.progress, icon: TrendingUp, exact: false },
      { href: "/settings", label: ar.nav.settings, icon: Settings, exact: false },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label={ar.nav.ariaDesktopNav}
      className="hidden md:flex flex-col w-64 border-e border-[#2A242E] bg-[#151318] h-screen sticky top-0 p-4 justify-between z-30 select-none"
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-[#2A242E] pb-4">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#C9A15A]/70 shadow-md shrink-0 bg-[#1D1920] relative">
            <Image
              src="/character/avatar.png"
              alt="Mini Fares"
              width={44}
              height={44}
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-sm text-[#F1E9DD] tracking-wider uppercase font-latin truncate">
              {ar.home.hubTitle}
            </h1>
            <p className="text-[10px] text-[#C9A15A] font-latin tracking-tight truncate">
              {ar.home.disciplineSlogan}
            </p>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-[#A7A0A6]/70 uppercase tracking-wider">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-150",
                      isActive
                        ? "bg-[#7A1735] text-[#F1E9DD] shadow-sm shadow-[#7A1735]/40 border border-[#A83252]/40"
                        : "text-[#A7A0A6] hover:text-[#F1E9DD] hover:bg-[#1D1920]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors shrink-0",
                        isActive ? "text-[#F1E9DD]" : "text-[#A7A0A6]"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Controls */}
      <div className="border-t border-[#2A242E] pt-4 space-y-2">
        <button
          onClick={async () => {
            await logoutAction();
            window.location.href = "/login";
          }}
          type="button"
          className="flex w-full items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl text-[#E05252] hover:text-red-300 hover:bg-[#4A1024]/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{ar.auth.logout}</span>
        </button>
      </div>
    </aside>
  );
}
