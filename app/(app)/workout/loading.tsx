export default function WorkoutLoading() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" dir="rtl">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-[#211C23] rounded-lg"></div>
          <div className="h-3 w-48 bg-[#211C23] rounded"></div>
        </div>
        <div className="h-9 w-28 bg-[#211C23] rounded-xl"></div>
      </div>

      {/* Program cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border-1.5 border-[#7C1D38]/40 bg-[#18151B] p-5 h-56 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-[#211C23] rounded"></div>
            <div className="h-5 w-16 bg-[#211C23] rounded"></div>
          </div>
          <div className="h-4 w-40 bg-[#211C23] rounded"></div>
          <div className="h-10 w-full bg-[#7C1D38]/30 rounded-xl mt-6"></div>
        </div>
        <div className="rounded-2xl border border-[#2B252E] bg-[#18151B] p-5 h-56 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-[#211C23] rounded"></div>
            <div className="h-5 w-16 bg-[#211C23] rounded"></div>
          </div>
          <div className="h-4 w-40 bg-[#211C23] rounded"></div>
          <div className="h-10 w-full bg-[#211C23] rounded-xl mt-6"></div>
        </div>
      </div>
    </div>
  );
}
