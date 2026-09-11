import Link from "next/link";
import { getTimeAwareGreeting } from "@/src/lib/utils";
import { ar } from "@/src/i18n/ar";
import { Dumbbell, Utensils, Calendar, ArrowLeft, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const greeting = getTimeAwareGreeting();

  const cards = [
    {
      title: ar.home.sections.workout.title,
      desc: ar.home.sections.workout.desc,
      cta: ar.home.sections.workout.cta,
      href: "/workout",
      icon: Dumbbell,
      accent: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      title: ar.home.sections.nutrition.title,
      desc: ar.home.sections.nutrition.desc,
      cta: ar.home.sections.nutrition.cta,
      href: "/nutrition",
      icon: Utensils,
      accent: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: ar.home.sections.activities.title,
      desc: ar.home.sections.activities.desc,
      cta: ar.home.sections.activities.cta,
      href: "/activities",
      icon: Calendar,
      accent: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {greeting}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {ar.home.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-amber-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{ar.home.quickStats.weightUnitNote}</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-gradient-to-b ${card.accent} border rounded-2xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-lg`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-100 mb-2">
                  {card.title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>

              <Link
                href={card.href}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-slate-100 transition-colors group"
              >
                <span>{card.cta}</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
