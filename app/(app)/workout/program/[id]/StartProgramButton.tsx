"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { startWorkoutSessionAction } from "@/src/server/workout-actions";
import { ar } from "@/src/i18n/ar";
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
      className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50"
    >
      <Play className="w-4 h-4 fill-current" />
      <span>{isPending ? ar.auth.loggingIn : label}</span>
    </button>
  );
}
