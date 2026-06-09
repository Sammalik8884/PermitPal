import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe2, Filter, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RequirementsPanel } from "./components/requirements-panel";
import { useEuProperties } from "@/hooks/use-eu-registration";
import { cn } from "@/lib/utils";

function EuRegistrationPage() {
  const navigate = useNavigate();
  const { data: properties, isLoading } = useEuProperties();
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProperties = properties?.filter((p) => {
    if (countryFilter !== "all" && p.countryCode !== countryFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const uniqueCountries = properties
    ? [...new Set(properties.map((p) => p.countryCode))].map((code) => {
        const prop = properties.find((p) => p.countryCode === code);
        return { code, name: prop?.countryName ?? code, flag: prop?.countryFlag ?? "" };
      })
    : [];

  const statusConfig = {
    not_started: { label: "Not Started", color: "bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400" },
    in_progress: { label: "In Progress", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" },
    completed: { label: "Completed", color: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
  };

  return (
    <>
      <PageHeader
        title="EU Registration"
        description="EU Short-Term Rental registration tracker"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Property Cards Grid */}
      {!isLoading && filteredProperties && filteredProperties.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {filteredProperties.map((property, index) => {
            const config = statusConfig[property.status];
            return (
              <motion.div
                key={property.propertyId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{property.countryFlag}</span>
                          <h3 className="font-semibold text-sm">
                            {property.propertyName}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {property.countryName}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn("text-xs shrink-0", config.color)}>
                        {config.label}
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {property.completedSteps}/{property.totalSteps} steps
                        </span>
                        <span className="font-medium">{property.percentComplete}%</span>
                      </div>
                      <Progress value={property.percentComplete} className="h-2" />
                    </div>

                    {/* Registration number if completed */}
                    {property.registrationNumber && (
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-md px-3 py-2">
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Registration #
                        </p>
                        <p className="text-sm font-mono font-bold text-green-700 dark:text-green-300">
                          {property.registrationNumber}
                        </p>
                      </div>
                    )}

                    {/* Action button */}
                    <Button
                      variant={property.status === "completed" ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/eu-registration/${property.propertyId}`)}
                    >
                      {property.status === "not_started" ? (
                        <>
                          <Play className="h-3.5 w-3.5 mr-1.5" />
                          Start
                        </>
                      ) : property.status === "in_progress" ? (
                        <>
                          <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                          Continue
                        </>
                      ) : (
                        "View Details"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredProperties && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Globe2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {countryFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters."
              : "Add a property in an EU jurisdiction to get started."}
          </p>
        </div>
      )}

      {/* Requirements Info Panel */}
      <RequirementsPanel
        selectedCountryCode={countryFilter !== "all" ? countryFilter : undefined}
      />
    </>
  );
}

export default EuRegistrationPage;
