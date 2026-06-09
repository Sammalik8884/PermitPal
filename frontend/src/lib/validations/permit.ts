import { z } from "zod";

// ─── Permit Form Schema ──────────────────────────────────────────────────────

export const createPermitSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  permitType: z.string().min(1, "Permit type is required"),
  permitNumber: z.string().optional(),
  status: z.enum(["pending", "active", "expired", "revoked"]),
  issuedAt: z.string().min(1, "Issue date is required"),
  expiresAt: z.string().min(1, "Expiry date is required"),
  issuingAuthority: z.string().optional(),
  notes: z.string().optional(),
});

export type CreatePermitFormData = z.infer<typeof createPermitSchema>;

// ─── Document Upload Schema ──────────────────────────────────────────────────

export const uploadDocumentSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  documentType: z.enum(["permit", "insurance", "tax", "identity", "other"]),
  permitId: z.string().optional(),
  description: z.string().optional(),
});

export type UploadDocumentFormData = z.infer<typeof uploadDocumentSchema>;
