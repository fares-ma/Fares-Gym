export default function ProgressLoading() {
  return (
    <div className="space-y-6 pb-8 animate-pulse" dir="rtl">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-[#211C23] rounded-lg"></div>
          <div className="h-3 w-48 bg-[#211C23] rounded"></div>
        </div>
        <div className="h-9 w-28 bg-[#7C1D38]/30 rounded-xl"></div>
      </div>

      {/* Consistency Cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-24"></div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-24"></div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-24"></div>
        <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-4 h-24"></div>
      </div>

      {/* PRs Section skeleton */}
      <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-5 space-y-4">
        <div className="h-5 w-32 bg-[#211C23] rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-20 bg-[#211C23] rounded-lg"></div>
          <div className="h-20 bg-[#211C23] rounded-lg"></div>
        </div>
      </div>

      {/* Chart Section skeleton */}
      <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-5 h-64"></div>
    </div>
  );
}
