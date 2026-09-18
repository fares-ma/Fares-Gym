import { getDailyNutrition } from "@/server/nutrition-queries";
import { NutritionView } from "@/ui/nutrition/NutritionView";
import { getUserTodayDateStr } from "@/lib/date-utils";

interface NutritionPageProps {
  searchParams?: Promise<{
    date?: string;
  }>;
}

export default async function NutritionPage({ searchParams }: NutritionPageProps) {
  const resolvedParams = await searchParams;
  const today = getUserTodayDateStr();
  const date = resolvedParams?.date || today;


  const summary = await getDailyNutrition(date);

  return <NutritionView initialSummary={summary} />;
}
