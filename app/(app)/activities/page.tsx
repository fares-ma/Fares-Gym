import { getActivitiesSummary } from "@/src/server/activities-queries";
import { ActivitiesView } from "@/src/ui/activities/ActivitiesView";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const summary = await getActivitiesSummary();

  return (
    <ActivitiesView
      initialSchedule={summary.schedule}
      initialReminders={summary.reminders}
      initialNotes={summary.notes}
    />
  );
}
