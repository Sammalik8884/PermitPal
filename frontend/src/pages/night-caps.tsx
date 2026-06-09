import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Calendar,
  Rss,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NightCapCard } from "./night-caps/components/night-cap-card";
import { MonthlyChart } from "./night-caps/components/monthly-chart";
import { BookingCalendar } from "./night-caps/components/booking-calendar";
import { AddNightsDialog } from "./night-caps/components/add-nights-dialog";
import { FeedList } from "./night-caps/components/feed-list";
import { AddFeedDialog } from "./night-caps/components/add-feed-dialog";
import {
  useNightCapSummaries,
  useBookedNights,
  useICalFeeds,
} from "@/hooks/use-night-caps";
import { useProperties } from "@/hooks/use-properties";

// ─── Night Caps Page ─────────────────────────────────────────────────────────

function NightCapsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCharts, setExpandedCharts] = useState<Set<string>>(new Set());

  // Dialogs
  const [addNightsOpen, setAddNightsOpen] = useState(false);
  const [addNightsPropertyId, setAddNightsPropertyId] = useState("");
  const [addNightsInitialDate, setAddNightsInitialDate] = useState<string | undefined>();
  const [addFeedOpen, setAddFeedOpen] = useState(false);
  const [addFeedPropertyId, setAddFeedPropertyId] = useState<string | undefined>();

  // Data
  const { data: summaries, isLoading } = useNightCapSummaries(selectedYear);
  const { data: bookedNights } = useBookedNights(
    selectedProperty !== "all" ? selectedProperty : undefined,
    selectedYear
  );
  const { data: feeds } = useICalFeeds(
    selectedProperty !== "all" ? selectedProperty : undefined
  );
  const { data: propertiesData } = useProperties();
  const properties = propertiesData ?? [];

  // Filtered summaries
  const filteredSummaries = useMemo(() => {
    if (!summaries) return [];
    if (selectedProperty === "all") return summaries;
    return summaries.filter((s) => s.propertyId === selectedProperty);
  }, [summaries, selectedProperty]);

  // Computed stats
  const stats = useMemo(() => {
    if (!summaries || summaries.length === 0) {
      return { totalUsed: 0, totalCap: 0, avgPercentage: 0, atRisk: 0 };
    }
    const totalUsed = summaries.reduce((sum, s) => sum + s.nightsUsed, 0);
    const totalCap = summaries.reduce((sum, s) => sum + s.nightCap, 0);
    const avgPercentage = Math.round(
      summaries.reduce((sum, s) => sum + s.percentage, 0) / summaries.length
    );
    const atRisk = summaries.filter((s) => s.percentage >= 80).length;
    return { totalUsed, totalCap, avgPercentage, atRisk };
  }, [summaries]);

  // Handlers
  function handleAddNight(propertyId: string) {
    setAddNightsPropertyId(propertyId);
    setAddNightsInitialDate(undefined);
    setAddNightsOpen(true);
  }

  function handleViewCalendar(propertyId: string) {
    setSelectedProperty(propertyId);
    setActiveTab("calendar");
  }

  function handleManageFeeds(propertyId: string) {
    setSelectedProperty(propertyId);
    setActiveTab("feeds");
  }

  function handleDayClick(date: string) {
    const propId = selectedProperty !== "all" ? selectedProperty : filteredSummaries[0]?.propertyId;
    if (propId) {
      setAddNightsPropertyId(propId);
      setAddNightsInitialDate(date);
      setAddNightsOpen(true);
    }
  }

  function toggleChart(propertyId: string) {
    setExpandedCharts((prev) => {
      const next = new Set(prev);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  }

  const selectedPropertyName =
    selectedProperty !== "all"
      ? properties.find((p) => p.id === selectedProperty)?.name ?? "Property"
      : "All Properties";

  return (
    <>
      <PageHeader
        title="Night Caps"
        description="Monitor your nightly rental limits"
        actions={
          <div className="flex items-center gap-2">
            {/* Year Selector */}
            <Select
              value={selectedYear.toString()}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                <SelectItem value={(currentYear - 2).toString()}>{currentYear - 2}</SelectItem>
              </SelectContent>
            </Select>

            {/* Property Selector */}
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Summary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              value={stats.totalUsed.toLocaleString()}
              label="Total Nights Used"
              icon={Moon}
              trend={{ direction: "up", value: `of ${stats.totalCap}` }}
            />
            <StatCard
              value={stats.totalCap.toLocaleString()}
              label="Total Cap Available"
              icon={Calendar}
              iconColor="text-blue-600"
            />
            <StatCard
              value={`${stats.avgPercentage}%`}
              label="Average Usage"
              icon={TrendingUp}
              iconColor="text-amber-600"
            />
            <StatCard
              value={stats.atRisk.toString()}
              label="Properties at Risk"
              icon={AlertTriangle}
              iconColor="text-red-600"
              trend={
                stats.atRisk > 0
                  ? { direction: "up", value: "> 80% usage" }
                  : { direction: "neutral", value: "All clear" }
              }
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="feeds" className="flex items-center gap-1.5">
                <Rss className="h-3.5 w-3.5" />
                Feeds
              </TabsTrigger>
            </TabsList>

            {/* ─── Overview Tab ─────────────────────────────────────────── */}
            <TabsContent value="overview">
              <AnimatePresence mode="wait">
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Per-Property Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {filteredSummaries.map((summary) => (
                      <NightCapCard
                        key={summary.propertyId}
                        data={summary}
                        onAddNight={handleAddNight}
                        onViewCalendar={handleViewCalendar}
                        onManageFeeds={handleManageFeeds}
                      />
                    ))}
                  </div>

                  {/* Monthly Breakdown Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Monthly Breakdown
                    </h3>
                    {filteredSummaries.map((summary) => (
                      <div key={`chart-${summary.propertyId}`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-left px-4 py-3 h-auto"
                          onClick={() => toggleChart(summary.propertyId)}
                        >
                          <span className="font-medium text-sm">
                            {summary.propertyName}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedCharts.has(summary.propertyId)
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </Button>
                        <AnimatePresence>
                          {expandedCharts.has(summary.propertyId) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <MonthlyChart
                                data={summary.monthlyBreakdown}
                                nightCap={summary.nightCap}
                                propertyName={summary.propertyName}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* ─── Calendar Tab ─────────────────────────────────────────── */}
            <TabsContent value="calendar">
              <AnimatePresence mode="wait">
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {selectedProperty === "all" ? (
                    <Card className="p-8 text-center">
                      <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <h4 className="text-sm font-medium mb-1">
                        Select a Property
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Choose a specific property from the filter above to view its booking calendar.
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {selectedPropertyName} — Booking Calendar
                        </h3>
                        <Button
                          size="sm"
                          onClick={() => handleAddNight(selectedProperty)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Manual Night
                        </Button>
                      </div>
                      <BookingCalendar
                        bookedNights={bookedNights ?? []}
                        onDayClick={handleDayClick}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            {/* ─── Feeds Tab ───────────────────────────────────────────── */}
            <TabsContent value="feeds">
              <AnimatePresence mode="wait">
                <motion.div
                  key="feeds"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {selectedProperty === "all" ? (
                    <Card className="p-8 text-center">
                      <Rss className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <h4 className="text-sm font-medium mb-1">
                        Select a Property
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Choose a specific property from the filter above to manage its iCal feeds.
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {selectedPropertyName} — iCal Feeds
                        </h3>
                        <Button
                          size="sm"
                          onClick={() => {
                            setAddFeedPropertyId(selectedProperty);
                            setAddFeedOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Feed
                        </Button>
                      </div>
                      <FeedList
                        feeds={feeds ?? []}
                        onAddFeed={() => {
                          setAddFeedPropertyId(selectedProperty);
                          setAddFeedOpen(true);
                        }}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Dialogs */}
      <AddNightsDialog
        open={addNightsOpen}
        onOpenChange={setAddNightsOpen}
        propertyId={addNightsPropertyId}
        propertyName={
          properties.find((p) => p.id === addNightsPropertyId)?.name ?? "Property"
        }
        initialDate={addNightsInitialDate}
      />

      <AddFeedDialog
        open={addFeedOpen}
        onOpenChange={setAddFeedOpen}
        defaultPropertyId={addFeedPropertyId}
      />
    </>
  );
}

export default NightCapsPage;
