import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

function BillingPage() {
  return (
    <>
      <PageHeader
        title="Billing"
        description="Manage your subscription and payment methods"
      />
      <EmptyState
        icon={CreditCard}
        title="For billing contact at permitpalpro@gmail.com"
        description=""
      />
    </>
  );
}

export default BillingPage;
