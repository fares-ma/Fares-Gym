"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { startWorkoutSessionAction } from "@/server/workout-actions";
import { ar } from "@/i18n/ar";
import { Play } from "lucide-react";

interface StartProgramButtonProps {
  programId: string;
  label: string;
}

export function StartProgramButton({ programId, label }: StartProgramButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    startTransition(async () => {
      const res = await startWorkoutSessionAction(programId);
      if (res.success && res.sessionId) {
        router.push("/workout/active");
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  return (
    <button
      onClick={handleStart}
      disabled={isPending}
      className="hub-btn-primary flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-sm tracking-wide transition-all shadow-lg shadow-[#7A1735]/40 cursor-pointer disabled:opacity-50"
    >
      <Play className="w-4 h-4 fill-current text-[#C9A15A]" />
      <span>{isPending ? ar.workout.active.saving : label}</span>
    </button>
  );
}

