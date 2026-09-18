export default function SettingsLoading() {
  return (
    <div className="space-y-6 pb-8 animate-pulse" dir="rtl">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-36 bg-[#211C23] rounded-lg"></div>
        <div className="h-3 w-48 bg-[#211C23] rounded"></div>
      </div>

      {/* Settings cards skeleton */}
      <div className="space-y-4">
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-5 h-40"></div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-5 h-36"></div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-5 h-48"></div>
      </div>
    </div>
  );
}
