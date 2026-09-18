export default function AppLoading() {
  return (
    <div className="space-y-4 md:space-y-5 pb-6 animate-pulse" dir="rtl">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-[#211C23] rounded"></div>
          <div className="h-7 w-48 bg-[#211C23] rounded-lg"></div>
          <div className="h-3 w-32 bg-[#211C23] rounded"></div>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#211C23] border-2 border-[#2B252E]"></div>
      </div>

      {/* Hero card skeleton */}
      <div className="rounded-2xl border-1.5 border-[#2B252E] bg-[#18151B] p-5 sm:p-6 min-h-[190px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="space-y-3 w-2/3">
            <div className="h-4 w-28 bg-[#211C23] rounded"></div>
            <div className="h-8 w-44 bg-[#211C23] rounded-lg"></div>
            <div className="h-4 w-60 bg-[#211C23] rounded"></div>
          </div>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-[#211C23]"></div>
        </div>
        <div className="h-10 w-36 bg-[#7C1D38]/30 rounded-xl mt-4"></div>
      </div>

      {/* Schedule stepper skeleton */}
      <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 space-y-3">
        <div className="h-4 w-32 bg-[#211C23] rounded"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="h-16 bg-[#211C23] rounded-lg"></div>
          <div className="h-16 bg-[#211C23] rounded-lg"></div>
          <div className="h-16 bg-[#211C23] rounded-lg"></div>
          <div className="h-16 bg-[#211C23] rounded-lg"></div>
        </div>
      </div>

      {/* Dual cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-48 space-y-3">
          <div className="h-4 w-28 bg-[#211C23] rounded"></div>
          <div className="h-24 bg-[#211C23] rounded-lg"></div>
        </div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-48 space-y-3">
          <div className="h-4 w-28 bg-[#211C23] rounded"></div>
          <div className="h-10 bg-[#211C23] rounded-lg"></div>
          <div className="h-10 bg-[#211C23] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
