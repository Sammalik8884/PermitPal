import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubscriptionStatus } from "@/hooks/use-billing";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";

// ─── Plan Features ───────────────────────────────────────────────────────────

const planFeatures: Record<string, string[]> = {
  free: ["1 property", "Basic compliance", "Email alerts"],
  starter: ["5 properties", "All compliance modules", "Email + SMS alerts"],
  professional: ["25 properties", "API access", "Priority support", "Team collaboration"],
  enterprise: ["Unlimited properties", "Custom integrations", "Dedicated support"],
};

// ─── Component ───────────────────────────────────────────────────────────────

export function CurrentPlanCard() {
  const { data: subscription, isLoading } = useSubscriptionStatus();

  if (isLoading || !subscription) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const features = planFeatures[subscription.plan] ?? [];
  const propertiesPercent = Math.round(
    (subscription.propertiesUsed / subscription.propertiesLimit) * 100
  );
  const membersPercent = Math.round(
    (subscription.membersUsed / subscription.membersLimit) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {subscription.status === "active" && "Active"}
              {subscription.status === "trialing" && "Trial"}
              {subscription.cancelAtPeriodEnd && " · Cancels at end of period"}
            </p>
          </div>
          <Badge variant={subscription.status === "active" ? "success" : "warning"} className="capitalize">
            {subscription.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features */}
          <div>
            <p className="text-sm font-medium mb-2">Plan Features</p>
            <ul className="space-y-1.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Usage */}
          <div className="space-y-4">
            <p className="text-sm font-medium">Usage</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Properties</span>
                <span className="font-medium">
                  {subscription.propertiesUsed} / {subscription.propertiesLimit}
                </span>
              </div>
              <Progress value={propertiesPercent} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Team Members</span>
                <span className="font-medium">
                  {subscription.membersUsed} / {subscription.membersLimit}
                </span>
              </div>
              <Progress value={membersPercent} className="h-2" />
            </div>
          </div>

          {/* Billing Period */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Next billing date</p>
              <p className="text-sm font-medium">
                {formatDate(subscription.currentPeriodEnd, "long")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
