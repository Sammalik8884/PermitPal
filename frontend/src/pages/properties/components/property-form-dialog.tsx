import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { createPropertySchema, type CreatePropertyFormData } from "@/lib/validations/property";
import { useCreateProperty, useUpdateProperty, useJurisdictions } from "@/hooks/use-properties";
import type { Property } from "@/types";

// ─── Countries ───────────────────────────────────────────────────────────────

const countries = [
  { code: "US", name: "United States" },
  { code: "FR", name: "France" },
  { code: "AU", name: "Australia" },
  { code: "CH", name: "Switzerland" },
  { code: "ES", name: "Spain" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "PT", name: "Portugal" },
  { code: "NL", name: "Netherlands" },
  { code: "CA", name: "Canada" },
  { code: "JP", name: "Japan" },
];

// ─── Property Form Dialog ────────────────────────────────────────────────────

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
}

export function PropertyFormDialog({ open, onOpenChange, property }: PropertyFormDialogProps) {
  const isEditing = !!property;
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const { data: jurisdictions } = useJurisdictions();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePropertyFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPropertySchema) as any,
    defaultValues: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postcode: "",
      countryCode: "",
      propertyType: "apartment",
      jurisdictionId: "",
      registrationNumber: "",
      bedrooms: undefined,
      bathrooms: undefined,
      notes: "",
    },
  });

  const watchedCountry = watch("countryCode");

  // Reset form when dialog opens/closes or property changes
  useEffect(() => {
    if (open && property) {
      reset({
        name: property.name,
        addressLine1: property.address,
        addressLine2: "",
        city: property.city,
        state: property.stateRegion,
        postcode: property.postalCode,
        countryCode: property.countryCode,
        propertyType: property.propertyType,
        jurisdictionId: property.jurisdictionId,
        registrationNumber: property.registrationNumber ?? "",
        bedrooms: property.bedroomCount,
        bathrooms: property.bathroomCount,
        notes: property.notes ?? "",
      });
    } else if (open && !property) {
      reset({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postcode: "",
        countryCode: "",
        propertyType: "apartment",
        jurisdictionId: "",
        registrationNumber: "",
        bedrooms: undefined,
        bathrooms: undefined,
        notes: "",
      });
    }
  }, [open, property, reset]);

  const onSubmit: SubmitHandler<CreatePropertyFormData> = async (data) => {
    try {
      if (isEditing && property) {
        await updateMutation.mutateAsync({ id: property.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Property" : "Add Property"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your property."
              : "Add a new short-term rental property to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Property Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Oceanview Retreat"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                placeholder="Street address"
                {...register("addressLine1")}
                aria-invalid={!!errors.addressLine1}
              />
              {errors.addressLine1 && (
                <p className="text-xs text-destructive">{errors.addressLine1.message}</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                placeholder="Apartment, suite, unit, etc."
                {...register("addressLine2")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="City"
                {...register("city")}
                aria-invalid={!!errors.city}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Region *</Label>
              <Input
                id="state"
                placeholder="State or region"
                {...register("state")}
                aria-invalid={!!errors.state}
              />
              {errors.state && (
                <p className="text-xs text-destructive">{errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                placeholder="Postal code"
                {...register("postcode")}
                aria-invalid={!!errors.postcode}
              />
              {errors.postcode && (
                <p className="text-xs text-destructive">{errors.postcode.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country *</Label>
              <Select
                value={watchedCountry}
                onValueChange={(value) => setValue("countryCode", value, { shouldValidate: true })}
              >
                <SelectTrigger id="countryCode" aria-invalid={!!errors.countryCode}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryCode && (
                <p className="text-xs text-destructive">{errors.countryCode.message}</p>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={watch("propertyType")}
                onValueChange={(value) => setValue("propertyType", value as CreatePropertyFormData["propertyType"], { shouldValidate: true })}
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="cabin">Cabin</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jurisdictionId">Jurisdiction</Label>
              <Select
                value={watch("jurisdictionId") ?? ""}
                onValueChange={(value) => setValue("jurisdictionId", value)}
              >
                <SelectTrigger id="jurisdictionId">
                  <SelectValue placeholder="Auto-detect or select" />
                </SelectTrigger>
                <SelectContent>
                  {(jurisdictions ?? []).map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                placeholder="Optional"
                {...register("registrationNumber")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("bedrooms")}
                  aria-invalid={!!errors.bedrooms}
                />
                {errors.bedrooms && (
                  <p className="text-xs text-destructive">{errors.bedrooms.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("bathrooms")}
                  aria-invalid={!!errors.bathrooms}
                />
                {errors.bathrooms && (
                  <p className="text-xs text-destructive">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this property..."
              {...register("notes")}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
              {isEditing ? "Save Changes" : "Create Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
