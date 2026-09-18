export default function ActivitiesLoading() {
  return (
    <div className="space-y-6 pb-8 animate-pulse" dir="rtl">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-[#211C23] rounded-lg"></div>
          <div className="h-3 w-48 bg-[#211C23] rounded"></div>
        </div>
      </div>

      {/* Weekday Selector skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <div className="h-10 w-16 bg-[#211C23] rounded-xl shrink-0"></div>
        <div className="h-10 w-16 bg-[#211C23] rounded-xl shrink-0"></div>
        <div className="h-10 w-16 bg-[#211C23] rounded-xl shrink-0"></div>
        <div className="h-10 w-16 bg-[#211C23] rounded-xl shrink-0"></div>
        <div className="h-10 w-16 bg-[#211C23] rounded-xl shrink-0"></div>
      </div>

      {/* Schedule Timeline skeleton */}
      <div className="rounded-xl border border-[#2B252E] bg-[#18151B] p-5 space-y-3">
        <div className="h-5 w-32 bg-[#211C23] rounded"></div>
        <div className="h-16 bg-[#211C23] rounded-lg"></div>
        <div className="h-16 bg-[#211C23] rounded-lg"></div>
        <div className="h-16 bg-[#211C23] rounded-lg"></div>
      </div>
    </div>
  );
}
