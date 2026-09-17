import { Settings, ShieldCheck, Sparkles, Moon, Database } from "lucide-react";
import { MiniFares } from "@/ui/MiniFares";
import { ThemeToggle } from "@/ui/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="comic-card p-6 border border-[#2B252E] flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="comic-badge text-[10px] bg-[#211C23] text-[#D6AA63]">
              HUB PREFERENCES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F2EADF] flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#7C1D38]" />
            <span>الإعدادات وتعيين الوحدات</span>
          </h1>
          <p className="text-xs text-[#9D969D] mt-1">
            تخصيص النظام وإدارة وحدات الأوزان الخاصة
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center">
          <MiniFares pose="settings-wrench" size="md" animate="breathe" />
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-3">
        {/* Theme Setting */}
        <div className="comic-card p-4 flex items-center justify-between border-[#2B252E]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#211C23] text-[#D6AA63]">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2EADF]">مظهر الواجهة</h4>
              <p className="text-[11px] text-[#9D969D]">
                الوضع الليلي الكرتوني (Dark Comic)
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Weight Notation Rules Card */}
        <div className="comic-card p-4 border-[#2B252E] space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#211C23] text-[#7C1D38]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2EADF]">
                قواعد تكويد الأوزان (Weight Notation)
              </h4>
              <p className="text-[11px] text-[#9D969D]">
                الوحدات الخاصة بأجهزة الجيم المحددة
              </p>
            </div>
          </div>
          <div className="bg-[#211C23] p-3 rounded-xl border border-[#362E3B] text-xs space-y-1.5 text-[#F2EADF]">
            <p>
              • <strong className="text-[#D6AA63] font-mono">K (Pin/Stack):</strong> معرّف داخلي خاص بالبلوكات أو الماكينات المعتمدة لديك.
            </p>
            <p>
              • <strong className="text-[#D6AA63] font-mono">B (Custom Unit):</strong> معرّف معزول لا يُخلط مع أوزان الكيلوجرام أو الباوند.
            </p>
            <p className="text-[11px] text-[#9D969D] pt-1">
              ممنوع التحويل التلقائي للأوزان لضمان الدقة وتفادي أي أخطاء حسابية.
            </p>
          </div>
        </div>

        {/* Database Source */}
        <div className="comic-card p-4 flex items-center justify-between border-[#2B252E]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#211C23] text-[#34D399]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F2EADF]">قاعدة البيانات</h4>
              <p className="text-[11px] text-[#9D969D]">
                Neon Serverless PostgreSQL (المصدر الوحيد للحقيقة)
              </p>
            </div>
          </div>
          <span className="comic-badge text-[10px] text-[#34D399] border-[#34D399]/40">
            ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}
