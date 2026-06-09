import { motion } from "framer-motion";
import { Building2, Shield, FileCheck, Moon } from "lucide-react";
import { format } from "date-fns";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useAuthStore } from "@/stores/auth-store";
import { ComplianceChart } from "@/pages/dashboard/compliance-chart";
import { PropertiesAtRisk } from "@/pages/dashboard/properties-at-risk";
import { UpcomingDeadlines } from "@/pages/dashboard/upcoming-deadlines";
import { RecentActivity } from "@/pages/dashboard/recent-activity";
import { NightCapBars } from "@/pages/dashboard/night-cap-bars";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getComplianceColor(score: number): string {
  if (score >= 80) return "text-[#1a7a40]";
  if (score >= 60) return "text-[#8a5c00]";
  return "text-[#c13515]";
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" width="30%" height="2rem" />
        <Skeleton variant="text" width="20%" height="1rem" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height="7rem" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Skeleton variant="rectangular" height="20rem" />
          <Skeleton variant="rectangular" height="14rem" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton variant="rectangular" height="16rem" />
          <Skeleton variant="rectangular" height="18rem" />
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────

function DashboardPage() {
  const { user: authUser } = useAuthStore();
  const {
    stats,
    properties,
    nightCaps,
    complianceHistory,
    propertiesAtRisk,
    upcomingDeadlines,
    recentActivity,
    isLoading,
  } = useDashboardData();

  // Use auth store user
  const firstName = authUser?.firstName ?? "User";
  const organisationName = authUser?.organisationName ?? "Your Organisation";

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* ─── Top Section: Welcome + Stats ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-1"
      >
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", lineHeight: "1.43", marginBottom: "4px" }}>
          {getGreeting()}, {firstName}
        </h1>
        <p style={{ fontSize: "16px", fontWeight: 400, color: "#6a6a6a", lineHeight: "1.5" }}>
          {organisationName} · {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </motion.div>

      {/* ─── Stat Cards Row ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total Properties"
          value={stats?.totalProperties ?? 0}
          icon={Building2}
          trend={{
            direction: "up",
            value: `+${stats?.propertiesAddedThisMonth ?? 0} this month`,
          }}
          iconColor="text-[#2a4db3]"
        />
        <StatCard
          label="Compliance Score"
          value={`${stats?.complianceScore ?? 0}%`}
          icon={Shield}
          trend={{ direction: "up", value: "+2% from last month" }}
          iconColor={getComplianceColor(stats?.complianceScore ?? 0)}
        />
        <StatCard
          label="Active Permits"
          value={stats?.activePermits ?? 0}
          icon={FileCheck}
          trend={{ direction: "neutral", value: "All current" }}
          iconColor="text-[#ff385c]"
        />
        <StatCard
          label="Nights Used"
          value={stats?.nightsUsed ?? 0}
          icon={Moon}
          trend={{
            direction: "neutral",
            value: `of ${stats?.totalNightCap ?? 0} total cap`,
          }}
          iconColor="text-[#8a5c00]"
        />
      </motion.div>


      {/* ─── Middle Section: Two-Column Layout ────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* Left Column (60%) */}
        <div className="lg:col-span-3 space-y-6">
          <ComplianceChart data={complianceHistory} isLoading={isLoading} />
          <PropertiesAtRisk data={propertiesAtRisk} isLoading={isLoading} />
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingDeadlines data={upcomingDeadlines} isLoading={isLoading} />
          <RecentActivity data={recentActivity} isLoading={isLoading} />
        </div>
      </motion.div>

      {/* ─── Bottom Section: Night Cap Usage ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <NightCapBars
          nightCaps={nightCaps}
          properties={properties}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}

export default DashboardPage;
