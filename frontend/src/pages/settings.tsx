import { Settings } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and organisation preferences"
      />
      <EmptyState
        icon={Settings}
        title="Settings"
        description="Account settings, notification preferences, team management, and API integrations will be available here."
      />
    </>
  );
}

export default SettingsPage;
