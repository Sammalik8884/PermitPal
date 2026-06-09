import { useState, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Upload, FileText, X } from "lucide-react";
import { uploadDocumentSchema, type UploadDocumentFormData } from "@/lib/validations/permit";
import { useUploadDocument } from "@/hooks/use-documents";
import { useProperties } from "@/hooks/use-properties";

// ─── Upload Dialog ───────────────────────────────────────────────────────────

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPropertyId?: string;
}

export function UploadDialog({ open, onOpenChange, defaultPropertyId }: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDocument();
  const { data: properties } = useProperties();

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadDocumentFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(uploadDocumentSchema) as any,
    defaultValues: {
      propertyId: defaultPropertyId || "",
      documentType: "other",
      description: "",
    },
  });

  const watchedPropertyId = watch("propertyId");
  const watchedDocumentType = watch("documentType");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<UploadDocumentFormData> = async (data) => {
    if (!selectedFile) return;

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        propertyId: data.propertyId,
        documentType: data.documentType,
        permitId: data.permitId,
        description: data.description,
      });
      handleClose();
    } catch {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    uploadMutation.resetProgress();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a compliance document such as a permit, insurance certificate, or tax form.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* File Drop Zone */}
          <div className="space-y-2">
            <Label>File *</Label>
            {!selectedFile ? (
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, images, or documents up to 10MB
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <FileText className="h-8 w-8 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
            />
          </div>

          {/* Property Select */}
          <div className="space-y-2">
            <Label htmlFor="upload-propertyId">Property *</Label>
            <Select
              value={watchedPropertyId}
              onValueChange={(value) => setValue("propertyId", value, { shouldValidate: true })}
            >
              <SelectTrigger id="upload-propertyId" aria-invalid={!!errors.propertyId}>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && (
              <p className="text-xs text-destructive">{errors.propertyId.message}</p>
            )}
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="upload-documentType">Document Type *</Label>
            <Select
              value={watchedDocumentType}
              onValueChange={(value) => setValue("documentType", value as UploadDocumentFormData["documentType"], { shouldValidate: true })}
            >
              <SelectTrigger id="upload-documentType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permit">Permit</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="identity">Identity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Progress */}
          {uploadMutation.isPending && uploadMutation.uploadProgress > 0 && (
            <div className="space-y-1">
              <Progress value={uploadMutation.uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                Uploading... {uploadMutation.uploadProgress}%
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploadMutation.isPending || !selectedFile}>
              {uploadMutation.isPending && <LoadingSpinner size="sm" className="mr-2" />}
              Upload Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
