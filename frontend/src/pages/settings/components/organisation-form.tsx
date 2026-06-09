import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useOrganisation } from "@/hooks/use-settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getInitials } from "@/lib/utils";

// ─── Component ───────────────────────────────────────────────────────────────

export function OrganisationForm() {
  const { data: org, isLoading } = useOrganisation();

  if (isLoading || !org) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organisation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {org.logoUrl ? (
                  <Building2 className="h-6 w-6" />
                ) : (
                  getInitials(org.name)
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" size="sm">
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                SVG, PNG or JPG. Max 1MB.
              </p>
            </div>
          </div>

          {/* Organisation Name */}
          <div className="space-y-2">
            <Label htmlFor="orgName">Organisation Name</Label>
            <Input
              id="orgName"
              defaultValue={org.name}
              placeholder="Organisation name"
            />
          </div>

          {/* Default Country */}
          <div className="space-y-2">
            <Label htmlFor="defaultCountry">Default Country</Label>
            <select
              id="defaultCountry"
              defaultValue={org.defaultCountry}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="AU">🇦🇺 Australia</option>
              <option value="FR">🇫🇷 France</option>
              <option value="ES">🇪🇸 Spain</option>
              <option value="CH">🇨🇭 Switzerland</option>
              <option value="GB">🇬🇧 United Kingdom</option>
            </select>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <Button type="button">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
