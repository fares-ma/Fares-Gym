import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4">
        <Settings className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-100 mb-2">الإعدادات وتعيين الوحدات</h1>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        شاشة التحكم في إعدادات النظام وتوضيح معاني وحدات K و B لكل تمرين مستقبلاً.
      </p>
    </div>
  );
}
