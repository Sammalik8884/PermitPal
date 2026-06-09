import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile } from "@/hooks/use-settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getInitials } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Timezone Options ────────────────────────────────────────────────────────

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Zurich",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Asia/Tokyo",
  "Asia/Singapore",
];

// ─── Component ───────────────────────────────────────────────────────────────

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone ?? "",
          timezone: profile.timezone,
        }
      : undefined,
  });

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  function onSubmit(data: ProfileFormData) {
    updateProfile.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      timezone: data.timezone,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {profile.avatarUrl ? (
                    <User className="h-6 w-6" />
                  ) : (
                    getInitials(`${profile.firstName} ${profile.lastName}`)
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm">
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change your email address.
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+1 (555) 000-0000"
              />
              <p className="text-xs text-muted-foreground">
                Used for SMS alerts. Include country code.
              </p>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                {...register("timezone")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty || updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
