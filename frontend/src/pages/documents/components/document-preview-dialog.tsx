import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, FileImage, File, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { getPropertyNameForDocument, useDocumentDownloadUrl } from "@/hooks/use-documents";
import type { Document } from "@/types";

// ─── Type Badge Config ───────────────────────────────────────────────────────

const typeConfig: Record<string, { label: string; className: string }> = {
  permit: { label: "Permit", className: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400" },
  insurance: { label: "Insurance", className: "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400" },
  tax: { label: "Tax", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400" },
  identity: { label: "Identity", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" },
  other: { label: "Other", className: "bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400" },
};

// ─── File Icon Helper ────────────────────────────────────────────────────────

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage;
  if (fileType.includes("pdf")) return FileText;
  return File;
}

// ─── Format File Size ────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Document Preview Dialog ─────────────────────────────────────────────────

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

export function DocumentPreviewDialog({ open, onOpenChange, document }: DocumentPreviewDialogProps) {
  const { data: realDownloadUrl, isLoading: isUrlLoading } = useDocumentDownloadUrl(document?.id);

  if (!document) return null;

  const FileIcon = getFileIcon(document.fileType);
  const typeInfo = typeConfig[document.documentType] ?? typeConfig.other;
  const propertyName = getPropertyNameForDocument(document.propertyId);
  const downloadUrl = realDownloadUrl || `https://storage.example.com/${document.storageKey}?token=mock-presigned`;
  const isImage = document.fileType.startsWith("image/");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon className="h-5 w-5 text-muted-foreground" />
            <span className="truncate">{document.fileName}</span>
          </DialogTitle>
          <DialogDescription>
            Document details and preview
          </DialogDescription>
        </DialogHeader>

        {/* Preview Area */}
        <div className="rounded-lg border bg-muted/30 p-8 flex items-center justify-center min-h-[200px]">
          {isImage ? (
            <div className="text-center space-y-3">
              <FileImage className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Image preview would display here in production
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <FileIcon className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                {document.fileType.includes("pdf")
                  ? "PDF preview would display here in production"
                  : "Document preview not available"}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Document Details */}
        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Property</p>
              <p className="font-medium">{propertyName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <Badge className={cn("mt-0.5", typeInfo.className)}>
                {typeInfo.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">File Size</p>
              <p className="font-medium">{formatFileSize(document.fileSizeBytes)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Uploaded</p>
              <p className="font-medium">{formatDate(document.uploadedAt, "long")}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">File Type</p>
            <p className="font-medium">{document.fileType}</p>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild className="flex-1" disabled={!realDownloadUrl}>
            {realDownloadUrl ? (
              <a href={realDownloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            ) : (
              <span className="cursor-not-allowed opacity-50 flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Loading...
              </span>
            )}
          </Button>
          <Button variant="outline" asChild disabled={!realDownloadUrl}>
            {realDownloadUrl ? (
              <a href={realDownloadUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </a>
            ) : (
              <span className="cursor-not-allowed opacity-50 flex items-center justify-center">
                <ExternalLink className="h-4 w-4 mr-2" />
                Loading...
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
