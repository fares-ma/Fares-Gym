import { TrendingUp, Sparkles, Activity } from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";
import { QuoteBanner } from "@/ui/QuoteBanner";

export default function ProgressPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Card with Character */}
      <div className="comic-card p-6 border border-[#2B252E] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2">
            <span className="comic-badge text-[10px] bg-[#211C23] text-[#D6AA63]">
              PHASE 4 ROADMAP
            </span>
            <span className="text-xs font-mono text-[#9D969D]">DATA & CHARTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F2EADF] flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#7C1D38]" />
            <span>التقدم والتحليلات</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9D969D] max-w-md leading-relaxed">
            رسوم Tremor التفاعلية لحجم التمارين وأوزان الـ PR لكل تمرين، ومخططات قياسات الجسم ونسبة الدهون.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#D6AA63]">
            <Sparkles className="w-4 h-4" />
            <span>قيد التطوير للمرحلة الرابعة</span>
          </div>
        </div>

        {/* Mini Fares Progress Character */}
        <div className="shrink-0 flex items-center justify-center">
          <MiniFares
            pose="progress-chart"
            size="lg"
            animate="breathe"
            alt="Mini Fares Progress"
          />
        </div>
      </div>

      {/* Motivational Progress Quote */}
      <QuoteBanner context="progress" tag="CONSISTENCY WINS" />
    </div>
  );
}
