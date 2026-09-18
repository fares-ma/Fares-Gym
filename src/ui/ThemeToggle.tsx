import { Moon } from "lucide-react";
import { ar } from "@/i18n/ar";

export function ThemeToggle() {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#211C23] border border-[#2B252E] text-[#D6AA63] select-none"
      title={ar.theme.comicDark}
      aria-label={ar.theme.comicDark}
    >
      <Moon className="w-3.5 h-3.5 text-[#D6AA63] fill-[#D6AA63]/20" />
      <span className="text-[11px] font-bold text-[#F2EADF]">{ar.theme.darkShort}</span>
    </div>
  );
}
