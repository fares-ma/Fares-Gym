"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Utensils, Calendar, Settings } from "lucide-react";
import { ar } from "../i18n/ar";
import { cn } from "../lib/utils";

const MOBILE_ITEMS = [
  { href: "/", label: ar.nav.today, icon: Home },
  { href: "/workout", label: ar.nav.workout, icon: Dumbbell },
  { href: "/nutrition", label: ar.nav.nutrition, icon: Utensils },
  { href: "/activities", label: ar.nav.activities, icon: Calendar },
  { href: "/settings", label: ar.nav.settings, icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/85 backdrop-blur-lg border-t border-slate-800/80 z-40 py-1.5 px-3">
      <div className="flex items-center justify-around">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors text-xs font-medium",
                isActive
                  ? "text-amber-400"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform",
                  isActive ? "scale-110 text-amber-400" : "text-slate-400"
                )}
              />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
