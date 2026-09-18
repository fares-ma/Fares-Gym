import { getAppSettingsSummary } from "@/src/server/settings-queries";
import { SettingsView } from "@/src/ui/settings/SettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const summary = await getAppSettingsSummary();

  return <SettingsView summary={summary} />;
}
