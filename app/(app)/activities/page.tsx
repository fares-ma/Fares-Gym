import { Calendar } from "lucide-react";

export default function ActivitiesPage() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-100 mb-2">الجدول والأنشطة</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        سيتم تفعيل تنظيم الأوقات والبلوكات والتذكيرات في المرحلة الثالثة (Phase 3).
      </p>
    </div>
  );
}
