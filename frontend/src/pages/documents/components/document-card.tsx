import { FileText, FileImage, File, Download, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { getPropertyNameForDocument } from "@/hooks/use-documents";
import type { Document } from "@/types";

// ─── File Type Icon Helper ───────────────────────────────────────────────────

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage;
  if (fileType.includes("pdf")) return FileText;
  return File;
}

// ─── Document Type Badge Config ──────────────────────────────────────────────

const typeConfig: Record<string, { label: string; className: string }> = {
  permit: { label: "Permit", className: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400" },
  insurance: { label: "Insurance", className: "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400" },
  tax: { label: "Tax", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400" },
  identity: { label: "Identity", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400" },
  other: { label: "Other", className: "bg-slate-100 text-slate-800 dark:bg-slate-950/30 dark:text-slate-400" },
};

// ─── Format File Size ────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Document Card Component ─────────────────────────────────────────────────

interface DocumentCardProps {
  document: Document;
  onPreview: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

export function DocumentCard({ document, onPreview, onDownload, onDelete }: DocumentCardProps) {
  const FileIcon = getFileIcon(document.fileType);
  const typeInfo = typeConfig[document.documentType] ?? typeConfig.other;
  const propertyName = getPropertyNameForDocument(document.propertyId);

  return (
    <div className="group relative rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" title={document.fileName}>
            {document.fileName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{propertyName}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <Badge className={cn("text-[10px] px-1.5 py-0", typeInfo.className)}>
          {typeInfo.label}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {formatFileSize(document.fileSizeBytes)}
        </span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">
          {formatDate(document.uploadedAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-1 opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onPreview(document)}
          title="Preview"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          title="Download"
          onClick={() => {
            if (onDownload) {
              onDownload(document);
            } else {
              window.open(`https://storage.example.com/${document.storageKey}`, "_blank");
            }
          }}
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(document)}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
