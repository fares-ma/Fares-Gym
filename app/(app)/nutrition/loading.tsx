export default function NutritionLoading() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" dir="rtl">
      {/* Date Navigator skeleton */}
      <div className="flex items-center justify-between bg-[#18151B] border border-[#2B252E] rounded-xl p-3">
        <div className="h-8 w-8 bg-[#211C23] rounded-lg"></div>
        <div className="h-5 w-36 bg-[#211C23] rounded"></div>
        <div className="h-8 w-8 bg-[#211C23] rounded-lg"></div>
      </div>

      {/* Macro Progress Cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-28 space-y-2">
          <div className="h-3 w-16 bg-[#211C23] rounded"></div>
          <div className="h-6 w-20 bg-[#211C23] rounded"></div>
          <div className="h-2 w-full bg-[#211C23] rounded-full"></div>
        </div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-28 space-y-2">
          <div className="h-3 w-16 bg-[#211C23] rounded"></div>
          <div className="h-6 w-20 bg-[#211C23] rounded"></div>
          <div className="h-2 w-full bg-[#211C23] rounded-full"></div>
        </div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-28 space-y-2">
          <div className="h-3 w-16 bg-[#211C23] rounded"></div>
          <div className="h-6 w-20 bg-[#211C23] rounded"></div>
          <div className="h-2 w-full bg-[#211C23] rounded-full"></div>
        </div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-28 space-y-2">
          <div className="h-3 w-16 bg-[#211C23] rounded"></div>
          <div className="h-6 w-20 bg-[#211C23] rounded"></div>
          <div className="h-2 w-full bg-[#211C23] rounded-full"></div>
        </div>
      </div>

      {/* Meals list skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-[#211C23] rounded"></div>
          <div className="h-8 w-24 bg-[#7C1D38]/30 rounded-lg"></div>
        </div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-24"></div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-24"></div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-24"></div>
      </div>
    </div>
  );
}
