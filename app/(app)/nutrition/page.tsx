import { Utensils } from "lucide-react";

export default function NutritionPage() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
        <Utensils className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-100 mb-2">التغذية والسعرات</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        سيتم تفعيل تسجيل الوجبات والسعرات والماكروز في المرحلة الثانية (Phase 2).
      </p>
    </div>
  );
}
