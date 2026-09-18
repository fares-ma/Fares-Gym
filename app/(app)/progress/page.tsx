import { getProgressSummary } from "@/src/server/progress-queries";
import { ProgressView } from "@/src/ui/progress/ProgressView";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const data = await getProgressSummary();

  return (
    <ProgressView
      consistency={data.consistency}
      bodyWeights={data.bodyWeights}
      prs={data.prs}
      volumes={data.volumes}
    />
  );
}
