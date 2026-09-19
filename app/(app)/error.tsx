"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { ar } from "@/src/i18n/ar";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime errors for diagnostic auditing
    console.error("Fares Hub App Error Boundary Caught:", error);
  }, [error]);

  return (
    <div
      dir="rtl"
      className="min-h-[60vh] flex items-center justify-center px-4 py-12"
    >
      <div className="comic-card w-full max-w-md p-6 sm:p-8 bg-[#151318] border border-[#2A242E] shadow-2xl rounded-2xl text-center space-y-6">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#7A1735]/20 border border-[#7A1735]/40 text-[#A83252] flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8 text-[#C9A15A]" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-[#F1E9DD]">
            {ar.errors.serverError || "حدث خطأ غير متوقع"}
          </h2>
          <p className="text-xs sm:text-sm text-[#A7A0A6] leading-relaxed">
            {ar.errors.generic}
          </p>
          {error?.digest && (
            <p className="text-[11px] font-mono text-[#6B646B] pt-1">
              رمز الخطأ: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7A1735]/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{ar.errors.retry}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1D1920] hover:bg-[#252029] text-[#F1E9DD] border border-[#2A242E] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4 text-[#A7A0A6]" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
