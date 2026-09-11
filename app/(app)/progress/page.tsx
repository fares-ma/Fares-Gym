import { TrendingUp } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4">
        <TrendingUp className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-100 mb-2">التقدم والتحليلات</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        سيتم تفعيل الرسوم البيانية لـ Tremor ومقاييس الجسم في المرحلة الرابعة (Phase 4).
      </p>
    </div>
  );
}
