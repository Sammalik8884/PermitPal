import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, FileText, Upload } from "lucide-react";
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
import { useDocuments, useDeleteDocument, type DocumentFilters } from "@/hooks/use-documents";
import { useDebounce } from "@/hooks/use-debounce";
import { useProperties } from "@/hooks/use-properties";
import { DocumentCard } from "./documents/components/document-card";
import { UploadDialog } from "./documents/components/upload-dialog";
import { DocumentPreviewDialog } from "./documents/components/document-preview-dialog";
import type { Document } from "@/types";
import { apiGet } from "@/lib/api";
import toast from "react-hot-toast";

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function DocumentsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="70%" height="0.875rem" />
              <Skeleton variant="text" width="50%" height="0.75rem" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="text" width="60px" height="1.25rem" className="rounded-full" />
            <Skeleton variant="text" width="40%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Documents Page ──────────────────────────────────────────────────────────

function DocumentsPage() {
  // Search & filters
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { data: properties } = useProperties();

  // Dialogs
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Delete mutation
  const deleteMutation = useDeleteDocument();

  // Build filters
  const filters: DocumentFilters = useMemo(() => ({
    search: debouncedSearch || undefined,
    propertyId: propertyFilter as DocumentFilters["propertyId"],
    documentType: typeFilter as DocumentFilters["documentType"],
  }), [debouncedSearch, propertyFilter, typeFilter]);

  const { data: documents, isLoading } = useDocuments(filters);

  // Handlers
  const handlePreview = (doc: Document) => {
    setPreviewDocument(doc);
    setPreviewDialogOpen(true);
  };

  const handleDelete = (doc: Document) => {
    if (window.confirm(`Delete "${doc.fileName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(doc.id);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await apiGet<{ url: string }>(`/documents/${doc.id}/download`);
      if (response.url) {
        window.open(response.url, "_blank");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document");
    }
  };

  return (
    <>
      <PageHeader
        title="Documents"
        description="Your compliance document vault"
      >
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="permit">Permit</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="tax">Tax</SelectItem>
            <SelectItem value="identity">Identity</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Document Count */}
      {documents && documents.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <DocumentsGridSkeleton />
      ) : !documents || documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description={
            debouncedSearch || propertyFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters to find what you're looking for."
              : "Upload permits, registrations, and other compliance documents to keep everything organized in one place."
          }
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <DocumentCard
                  document={doc}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Dialogs */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
      <DocumentPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        document={previewDocument}
      />
    </>
  );
}

export default DocumentsPage;
