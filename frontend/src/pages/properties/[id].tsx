import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MapPin,
  Bed,
  Bath,
  FileCheck,
  Moon,
  FileText,
  Activity,
  Calendar,
  Upload,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useProperty,
  usePropertyCompliance,
  usePropertyPermits,
  usePropertyNightCap,
  usePropertyDocuments,
  usePropertyActivity,
} from "@/hooks/use-properties";
import { ComplianceBreakdown } from "./components/compliance-breakdown";
import { ComplianceScoreCircle, propertyTypeConfig } from "./components/property-card";
import { PropertyFormDialog } from "./components/property-form-dialog";
import { DeletePropertyDialog } from "./components/delete-property-dialog";
import { PermitFormDialog } from "@/pages/permits/components/permit-form-dialog";
import { UploadDialog } from "@/pages/documents/components/upload-dialog";
import { formatDate, cn } from "@/lib/utils";
import type { ActivityItem } from "@/lib/mock-data";

// ─── Activity Type Config (for timeline) ─────────────────────────────────────

const activityIcons: Record<string, { icon: typeof Activity; color: string }> = {
  permit: { icon: FileCheck, color: "text-blue-500" },
  ical_sync: { icon: Calendar, color: "text-emerald-500" },
  regulatory: { icon: FileText, color: "text-amber-500" },
  compliance: { icon: Activity, color: "text-purple-500" },
  night_cap: { icon: Moon, color: "text-orange-500" },
  property: { icon: MapPin, color: "text-indigo-500" },
  document: { icon: FileText, color: "text-teal-500" },
};

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function PropertyDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2">
          <Skeleton variant="text" width="200px" height="1.5rem" />
          <Skeleton variant="text" width="300px" height="0.875rem" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton variant="rectangular" width="100%" height="200px" className="rounded-lg" />
        <Skeleton variant="rectangular" width="100%" height="200px" className="rounded-lg" />
      </div>
    </div>
  );
}

// ─── Property Detail Page ────────────────────────────────────────────────────

function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: property, isLoading: propertyLoading } = useProperty(id);
  const { data: compliance, isLoading: complianceLoading } = usePropertyCompliance(id);
  const { data: permits } = usePropertyPermits(id);
  const { data: nightCap } = usePropertyNightCap(id);
  const { data: documents } = usePropertyDocuments(id);
  const { data: activity } = usePropertyActivity(id);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permitDialogOpen, setPermitDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  if (propertyLoading) {
    return (
      <>
        <PageHeader
          title="Loading..."
          breadcrumbs={[
            { label: "Properties", href: "/properties" },
            { label: "Details" },
          ]}
        />
        <PropertyDetailSkeleton />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <PageHeader
          title="Property Not Found"
          breadcrumbs={[
            { label: "Properties", href: "/properties" },
            { label: "Not Found" },
          ]}
        />
        <EmptyState
          title="Property not found"
          description="The property you're looking for doesn't exist or has been removed."
          action={{ label: "Back to Properties", onClick: () => navigate("/properties") }}
        />
      </>
    );
  }

  const typeConfig = propertyTypeConfig[property.propertyType];
  const TypeIcon = typeConfig.icon;

  return (
    <>
      {/* Header */}
      <div className="space-y-4 pb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/properties")}
        >
          <ArrowLeft className="h-4 w-4" />
          Properties
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", typeConfig.color)}>
              <TypeIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
                <ComplianceScoreCircle score={property.complianceScore} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {property.address}, {property.city}, {property.stateRegion}, {property.countryCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permits">Permits</TabsTrigger>
          <TabsTrigger value="nightcap">Night Cap</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* ─── Overview Tab ─────────────────────────────────────────────── */}
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {/* Property Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Type" value={typeConfig.label} />
                  <InfoItem label="Jurisdiction" value={property.jurisdictionName} />
                  <InfoItem label="Registration" value={property.registrationNumber ?? "—"} />
                  <InfoItem label="Country" value={property.countryCode} />
                  <InfoItem
                    label="Bedrooms"
                    value={String(property.bedroomCount)}
                    icon={<Bed className="h-3.5 w-3.5 text-muted-foreground" />}
                  />
                  <InfoItem
                    label="Bathrooms"
                    value={String(property.bathroomCount)}
                    icon={<Bath className="h-3.5 w-3.5 text-muted-foreground" />}
                  />
                </div>
                {property.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{property.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <QuickStat
                  label="Active Permits"
                  value={String(permits?.filter((p) => p.status === "active").length ?? 0)}
                  icon={<FileCheck className="h-4 w-4 text-blue-500" />}
                />
                <QuickStat
                  label="Nights Used"
                  value={nightCap ? `${nightCap.nightsUsed}/${nightCap.nightCap}` : "—"}
                  icon={<Moon className="h-4 w-4 text-orange-500" />}
                />
                <QuickStat
                  label="Documents"
                  value={String(documents?.length ?? 0)}
                  icon={<FileText className="h-4 w-4 text-teal-500" />}
                />
              </div>

              {/* Compliance Breakdown */}
              {complianceLoading ? (
                <Skeleton variant="rectangular" width="100%" height="300px" className="rounded-lg" />
              ) : compliance ? (
                <ComplianceBreakdown data={compliance} />
              ) : null}
            </div>
          </motion.div>
        </TabsContent>

        {/* ─── Permits Tab ──────────────────────────────────────────────── */}
        <TabsContent value="permits">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Permits</h3>
              <Button size="sm" className="gap-1.5" onClick={() => setPermitDialogOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Add Permit
              </Button>
            </div>
            {(permits?.length ?? 0) === 0 ? (
              <EmptyState
                icon={FileCheck}
                title="No permits"
                description="No permits have been added for this property yet."
                action={{ label: "Add Permit", onClick: () => setPermitDialogOpen(true) }}
              />
            ) : (
              <div className="space-y-3">
                {permits?.map((permit) => {
                  const daysRemaining = Math.ceil(
                    (new Date(permit.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <Card key={permit.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{permit.permitType}</h4>
                            <StatusBadge
                              status={permit.status === "active" ? "active" : permit.status === "expired" ? "expired" : "pending"}
                              showTooltip={false}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {permit.permitNumber} • {permit.issuingAuthority}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Expires</p>
                          <p className={cn("text-sm font-medium", daysRemaining < 30 ? "text-red-600" : "text-foreground")}>
                            {formatDate(permit.expiresAt)}
                          </p>
                          {daysRemaining > 0 && (
                            <p className={cn("text-xs", daysRemaining < 30 ? "text-red-500" : "text-muted-foreground")}>
                              {daysRemaining} days remaining
                            </p>
                          )}
                        </div>
                      </div>
                      {permit.notes && (
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">{permit.notes}</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* ─── Night Cap Tab ────────────────────────────────────────────── */}
        <TabsContent value="nightcap">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-semibold">Night Cap Usage</h3>
            {nightCap ? (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{nightCap.nightsUsed} <span className="text-sm font-normal text-muted-foreground">/ {nightCap.nightCap} nights</span></p>
                      <p className="text-sm text-muted-foreground">{nightCap.year} Annual Cap</p>
                    </div>
                    <Badge variant={nightCap.percentage > 80 ? "destructive" : nightCap.percentage > 60 ? "secondary" : "default"}>
                      {nightCap.percentage}% used
                    </Badge>
                  </div>
                  <Progress value={nightCap.percentage} size="lg" showLabel />
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Used</p>
                      <p className="text-lg font-semibold">{nightCap.nightsUsed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="text-lg font-semibold">{nightCap.nightsRemaining}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className={cn("text-lg font-semibold capitalize", 
                        nightCap.status === "critical" ? "text-red-600" :
                        nightCap.status === "warning" ? "text-yellow-600" : "text-green-600"
                      )}>
                        {nightCap.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={Moon}
                title="No night cap data"
                description="Night cap tracking will appear here once configured."
              />
            )}
          </motion.div>
        </TabsContent>

        {/* ─── Documents Tab ────────────────────────────────────────────── */}
        <TabsContent value="documents">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documents</h3>
              <Button size="sm" className="gap-1.5" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-3.5 w-3.5" />
                Upload
              </Button>
            </div>
            {(documents?.length ?? 0) === 0 ? (
              <EmptyState
                icon={FileText}
                title="No documents"
                description="Upload permits, insurance certificates, and other documents."
                action={{ label: "Upload Document", onClick: () => setUploadDialogOpen(true) }}
              />
            ) : (
              <div className="space-y-2">
                {documents?.map((doc) => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.fileSizeBytes / 1024).toFixed(0)} KB • Uploaded {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {doc.documentType}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* ─── Activity Tab ─────────────────────────────────────────────── */}
        <TabsContent value="activity">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-lg font-semibold">Activity Log</h3>
            {(activity?.length ?? 0) === 0 ? (
              <EmptyState
                icon={Activity}
                title="No activity"
                description="Activity for this property will appear here."
              />
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-0">
                  {activity?.map((item: ActivityItem, index: number) => {
                    const config = activityIcons[item.type] ?? activityIcons.compliance;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="relative flex items-start gap-4 py-3 pl-10"
                      >
                        <div className={cn(
                          "absolute left-2 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-background border",
                        )}>
                          <Icon className={cn("h-3 w-3", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(item.timestamp, "relative")}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <PropertyFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        property={property}
      />
      <DeletePropertyDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        property={property}
        onSuccess={() => navigate("/properties")}
      />
      <PermitFormDialog
        open={permitDialogOpen}
        onOpenChange={setPermitDialogOpen}
        defaultPropertyId={property.id}
      />
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        defaultPropertyId={property.id}
      />
    </>
  );
}

// ─── Helper Components ───────────────────────────────────────────────────────

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </Card>
  );
}

export default PropertyDetailPage;
