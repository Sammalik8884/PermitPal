import { z } from "zod";

// ─── Property Form Schema ────────────────────────────────────────────────────

export const createPropertySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  countryCode: z.string().min(2, "Country is required"),
  propertyType: z.enum(["apartment", "house", "villa", "condo", "cabin", "other"]),
  jurisdictionId: z.string().optional(),
  registrationNumber: z.string().optional(),
  bedrooms: z.union([z.coerce.number().min(0, "Must be 0 or more"), z.literal("").transform(() => undefined)]).optional(),
  bathrooms: z.union([z.coerce.number().min(0, "Must be 0 or more"), z.literal("").transform(() => undefined)]).optional(),
  notes: z.string().optional(),
});

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = createPropertySchema.partial().extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>;
