import { Calendar, Laptop, Sparkles } from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";
import { QuoteBanner } from "@/ui/QuoteBanner";

export default function ActivitiesPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Card with Character */}
      <div className="comic-card p-6 border border-[#2B252E] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2">
            <span className="comic-badge text-[10px] bg-[#211C23] text-[#D6AA63]">
              PHASE 3 ROADMAP
            </span>
            <span className="text-xs font-mono text-[#9D969D]">PLAN & EXECUTE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F2EADF] flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-[#7C1D38]" />
            <span>الجدول والأنشطة</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9D969D] max-w-md leading-relaxed">
            تنظيم البلوكات الزمنية لليوم (جيم، مذاكرة، عمل، راحة)، وإدارة قائمة التذكيرات اليومية الذكية.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#D6AA63]">
            <Sparkles className="w-4 h-4" />
            <span>قيد التطوير للمرحلة الثالثة</span>
          </div>
        </div>

        {/* Mini Fares Study/Work Character */}
        <div className="shrink-0 flex items-center justify-center">
          <MiniFares
            pose="study-laptop"
            size="lg"
            animate="breathe"
            alt="Mini Fares Activities"
          />
        </div>
      </div>

      {/* Motivational Activities Quote */}
      <QuoteBanner context="activities" tag="ONE TASK AT A TIME" />
    </div>
  );
}
