import { getDailyNutrition } from "@/src/server/nutrition-queries";
import { NutritionView } from "@/src/ui/nutrition/NutritionView";

interface NutritionPageProps {
  searchParams?: Promise<{
    date?: string;
  }>;
}

export default async function NutritionPage({ searchParams }: NutritionPageProps) {
  const resolvedParams = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const date = resolvedParams?.date || today;

  const summary = await getDailyNutrition(date);

  return <NutritionView initialSummary={summary} />;
}
