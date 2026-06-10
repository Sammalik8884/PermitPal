import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, LayoutGrid, List, Building2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProperties, type PropertyFilters } from "@/hooks/use-properties";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useDebounce } from "@/hooks/use-debounce";
import { PropertyCard } from "./components/property-card";
import { PropertyTable } from "./components/property-table";
import { PropertyFormDialog } from "./components/property-form-dialog";
import { DeletePropertyDialog } from "./components/delete-property-dialog";
import type { Property } from "@/types";

// ─── View Type ───────────────────────────────────────────────────────────────

type ViewMode = "grid" | "list";

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function PropertiesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="rectangular" width={36} height={36} className="rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="70%" height="0.875rem" />
              <Skeleton variant="text" width="50%" height="0.75rem" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width="60px" height="1.25rem" className="rounded-full" />
            <Skeleton variant="text" width="40%" height="0.75rem" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton variant="circular" width={38} height={38} />
            <Skeleton variant="text" width="80px" height="1.25rem" className="rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Properties Page ─────────────────────────────────────────────────────────

function PropertiesPage() {
  // View mode persisted in localStorage
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>("properties-view-mode", "grid");

  // Search & filters
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [complianceStatus, setComplianceStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Dialogs
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  // Build filters
  const filters: PropertyFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    propertyType: propertyType as PropertyFilters["propertyType"],
    complianceStatus: complianceStatus as PropertyFilters["complianceStatus"],
    sortBy: sortBy as PropertyFilters["sortBy"],
    sortOrder: sortBy === "complianceScore" ? "desc" : "asc",
  }), [debouncedSearch, propertyType, complianceStatus, sortBy]);

  const { data: properties, isLoading } = useProperties(filters);

  // Handlers
  const handleAddProperty = () => {
    setEditingProperty(null);
    setFormDialogOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setFormDialogOpen(true);
  };

  const handleDeleteProperty = (property: Property) => {
    setDeletingProperty(property);
    setDeleteDialogOpen(true);
  };

  const hasProperties = (properties?.length ?? 0) > 0;
  const hasFilters = !!debouncedSearch || propertyType !== "all" || complianceStatus !== "all";

  return (
    <>
      <PageHeader
        title="Properties"
        description="Manage your short-term rental portfolio"
        actions={
          <Button onClick={handleAddProperty} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        }
      />

      {/* Filters Bar */}
      {(hasProperties || hasFilters || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6"
        >
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Property Type Filter */}
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="cabin">Cabin</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Compliance Status Filter */}
            <Select value={complianceStatus} onValueChange={setComplianceStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="non_compliant">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="complianceScore">Compliance</SelectItem>
                <SelectItem value="createdAt">Date Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("list")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <PropertiesGridSkeleton />
        ) : !hasProperties && !hasFilters ? (
          <EmptyState
            icon={Building2}
            title="No properties yet"
            description="Add your first short-term rental property to start tracking compliance, permits, and night caps."
            action={{
              label: "Add Property",
              onClick: handleAddProperty,
            }}
          />
        ) : !hasProperties && hasFilters ? (
          <EmptyState
            icon={Search}
            title="No properties found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={{
              label: "Clear Filters",
              onClick: () => {
                setSearchInput("");
                setPropertyType("all");
                setComplianceStatus("all");
              },
            }}
          />
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {(properties ?? []).map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />
            ))}
          </motion.div>
        ) : (
          <PropertyTable
            key="list"
            properties={properties ?? []}
            filters={filters}
            onFiltersChange={() => {}}
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
          />
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <PropertyFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        property={editingProperty}
      />
      <DeletePropertyDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        property={deletingProperty}
      />
    </>
  );
}

export default PropertiesPage;
