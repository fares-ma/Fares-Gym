export default function AppLoading() {
  return (
    <div className="space-y-4 md:space-y-5 pb-6 animate-pulse" dir="rtl">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-[#1D1920] rounded"></div>
          <div className="h-7 w-48 bg-[#1D1920] rounded-lg"></div>
          <div className="h-3 w-32 bg-[#1D1920] rounded"></div>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#1D1920] border-2 border-[#2A242E]"></div>
      </div>

      {/* Hero card skeleton */}
      <div className="rounded-2xl border border-[#2A242E] bg-[#151318] p-5 sm:p-6 min-h-[190px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="space-y-3 w-2/3">
            <div className="h-4 w-28 bg-[#1D1920] rounded"></div>
            <div className="h-8 w-44 bg-[#1D1920] rounded-lg"></div>
            <div className="h-4 w-60 bg-[#1D1920] rounded"></div>
          </div>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-[#1D1920] border border-[#2A242E]"></div>
        </div>
        <div className="h-10 w-36 bg-[#7A1735]/30 rounded-xl mt-4 border border-[#7A1735]/40"></div>
      </div>

      {/* Schedule stepper skeleton */}
      <div className="rounded-xl border border-[#2A242E] bg-[#151318] p-4 space-y-3">
        <div className="h-4 w-32 bg-[#1D1920] rounded"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="h-16 bg-[#1D1920] rounded-lg border border-[#2A242E]"></div>
          <div className="h-16 bg-[#1D1920] rounded-lg border border-[#2A242E]"></div>
          <div className="h-16 bg-[#1D1920] rounded-lg border border-[#2A242E]"></div>
          <div className="h-16 bg-[#1D1920] rounded-lg border border-[#2A242E]"></div>
        </div>
      </div>

      {/* Dual cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#2A242E] bg-[#151318] p-4 h-48 space-y-3">
          <div className="h-4 w-28 bg-[#1D1920] rounded"></div>
          <div className="h-24 bg-[#1D1920] rounded-lg border border-[#2A242E]"></div>
        </div>
        <div className="rounded-xl border border-[#2A242E] bg-[#151318] p-4 h-48 space-y-3">
          <div className="h-4 w-28 bg-[#1D1920] rounded"></div>
          <div className="h-10 bg-[#1D1920] rounded-lg border border-[#2A242E]"></div>
          <div className="h-10 bg-[#1D1920] rounded-lg border border-[#2A242E]"></div>
        </div>
      </div>
    </div>
  );
}
