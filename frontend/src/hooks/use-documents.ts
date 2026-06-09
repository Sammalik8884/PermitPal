import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { mockDocuments, mockProperties } from "@/lib/mock-data";
import type { Document } from "@/types";
import { generateId } from "@/lib/utils";
import toast from "react-hot-toast";

import apiClient, { apiGet, apiPost, apiDelete } from "@/lib/api";

// ─── Toggle for mock vs real API ─────────────────────────────────────────────

const USE_MOCK = false;

// ─── Simulated API delay ─────────────────────────────────────────────────────

function simulateDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export type DocumentType = "permit" | "insurance" | "tax" | "identity" | "other";

export interface DocumentFilters {
  search?: string;
  propertyId?: string | "all";
  documentType?: DocumentType | "all";
}

// ─── Documents List Hook ─────────────────────────────────────────────────────

export function useDocuments(filters: DocumentFilters = {}) {
  return useQuery<Document[]>({
    queryKey: ["documents", filters],
    queryFn: async () => {
      if (USE_MOCK) {
        let result = [...mockDocuments];

        // Search filter
        if (filters.search) {
          const search = filters.search.toLowerCase();
          result = result.filter((d) =>
            d.fileName.toLowerCase().includes(search)
          );
        }

        // Property filter
        if (filters.propertyId && filters.propertyId !== "all") {
          result = result.filter((d) => d.propertyId === filters.propertyId);
        }

        // Document type filter
        if (filters.documentType && filters.documentType !== "all") {
          result = result.filter((d) => d.documentType === filters.documentType);
        }

        // Sort by upload date (newest first)
        result.sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

        return simulateDelay(result);
        return simulateDelay(result);
      }

      let url = "/documents";
      if (filters.propertyId && filters.propertyId !== "all") {
        url += `?propertyId=${filters.propertyId}`;
      }
      // Note: If backend supports other filters, append them here.
      
      const dtos = await apiGet<any[]>(url);
      
      let result = dtos.map(d => ({
        id: d.id,
        propertyId: d.propertyId || "unknown-property", // fallback if backend doesn't send it in GetAll
        organisationId: d.organisationId || "",
        fileName: d.name || "Unnamed Document",
        fileType: d.mimeType || "",
        fileSizeBytes: d.fileSizeBytes || 0,
        documentType: d.documentType?.toLowerCase() || "other",
        storageKey: d.fileUrl || "",
        uploadedBy: d.uploadedByUserId || "System",
        uploadedAt: d.createdAt || new Date().toISOString()
      })) as Document[];
      
      // Client-side filtering if backend doesn't support it
      if (filters.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(d => d.fileName.toLowerCase().includes(search));
      }
      if (filters.documentType && filters.documentType !== "all") {
        result = result.filter(d => d.documentType === filters.documentType);
      }
      
      result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      
      return result;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Upload Document Mutation ────────────────────────────────────────────────

interface UploadDocumentInput {
  file: File;
  propertyId: string;
  documentType: DocumentType;
  permitId?: string;
  description?: string;
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (input: UploadDocumentInput): Promise<Document> => {
      if (USE_MOCK) {
        // Simulate upload progress
        setUploadProgress(0);
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          setUploadProgress(i);
        }

        const newDoc: Document = {
          id: `doc-${generateId().slice(0, 8)}`,
          propertyId: input.propertyId,
          organisationId: "org-001",
          fileName: input.file.name,
          fileType: input.file.type,
          fileSizeBytes: input.file.size,
          documentType: input.documentType,
          storageKey: `docs/${input.propertyId}/${input.file.name}`,
          uploadedBy: "user-001",
          uploadedAt: new Date().toISOString(),
        };

        mockDocuments.push(newDoc);
        return simulateDelay(newDoc, 300);
      }
      
      const formData = new FormData();
      formData.append("file", input.file);
      formData.append("propertyId", input.propertyId);
      formData.append("documentType", input.documentType);
      if (input.permitId) formData.append("permitId", input.permitId);
      if (input.description) formData.append("description", input.description);

      const res = await apiClient.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      
      const d = res.data;
      setUploadProgress(100);
      
      return {
        id: d.id,
        propertyId: d.propertyId,
        organisationId: d.organisationId,
        fileName: d.fileName,
        fileType: d.fileType,
        fileSizeBytes: d.fileSizeBytes,
        documentType: d.documentType,
        storageKey: d.storageKey,
        uploadedBy: d.uploadedBy,
        uploadedAt: d.uploadedAt
      } as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["property-documents"] });
      toast.success("Document uploaded successfully");
      setUploadProgress(0);
    },
    onError: () => {
      toast.error("Failed to upload document");
      setUploadProgress(0);
    },
  });

  const resetProgress = useCallback(() => setUploadProgress(0), []);

  return { ...mutation, uploadProgress, resetProgress };
}

// ─── Delete Document Mutation ────────────────────────────────────────────────

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockDocuments.findIndex((d) => d.id === id);
        if (index !== -1) mockDocuments.splice(index, 1);
        return simulateDelay(undefined, 600);
      }
      
      await apiDelete(`/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["property-documents"] });
      toast.success("Document deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete document");
    },
  });
}

// ─── Document Download URL Hook ──────────────────────────────────────────────

export function useDocumentDownloadUrl(id: string | undefined) {
  return useQuery<string | null>({
    queryKey: ["document-download-url", id],
    queryFn: async () => {
      if (!id) return null;
      if (USE_MOCK) {
        // In real app, this would return a presigned URL
        const doc = mockDocuments.find((d) => d.id === id);
        if (!doc) return null;
        return simulateDelay(`https://storage.example.com/${doc.storageKey}?token=mock-presigned`);
      }
      
      const response = await apiGet<{ url: string }>(`/documents/${id}/download`);
      return response.url;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Helper: Get property name for a document ────────────────────────────────

export function getPropertyNameForDocument(propertyId: string): string {
  return mockProperties.find((p) => p.id === propertyId)?.name ?? "Unknown Property";
}
