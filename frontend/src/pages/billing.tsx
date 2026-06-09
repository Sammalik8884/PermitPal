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
        title="No billing information"
        description="Your subscription plan, invoices, and payment methods will appear here once your account is activated."
      />
    </>
  );
}

export default BillingPage;
