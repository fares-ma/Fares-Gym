"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  Utensils,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAction } from "../server/auth";
import { ThemeToggle } from "./ThemeToggle";
import { ar } from "../i18n/ar";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { href: "/", label: ar.nav.today, icon: Home },
  { href: "/workout", label: ar.nav.workout, icon: Dumbbell },
  { href: "/nutrition", label: ar.nav.nutrition, icon: Utensils },
  { href: "/activities", label: ar.nav.activities, icon: Calendar },
  { href: "/progress", label: ar.nav.progress, icon: TrendingUp },
  { href: "/settings", label: ar.nav.settings, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-s border-slate-800/80 bg-slate-900/40 backdrop-blur-xl h-screen sticky top-0 p-4 justify-between z-30">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-800/60 pb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-md flex-shrink-0 bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fares.jpeg"
              alt="Fares"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-100 tracking-tight">
              فارس
            </h1>
            <p className="text-xs text-amber-400 font-medium">Fares Hub</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-amber-400" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Controls */}
      <div className="border-t border-slate-800/60 pt-4 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-slate-500">المظهر</span>
          <ThemeToggle />
        </div>

        <button
          onClick={async () => {
            await logoutAction();
            window.location.href = "/login";
          }}
          type="button"
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{ar.auth.logout}</span>
        </button>
      </div>
    </aside>
  );
}
