import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAlertPreferences, useUpdateAlertPreferences } from "@/hooks/use-alerts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { AlertPreferences } from "@/lib/mock-data-extended";
import { useState, useEffect } from "react";

// ─── Component ───────────────────────────────────────────────────────────────

export function AlertPreferencesForm() {
  const { data: preferences, isLoading } = useAlertPreferences();
  const updatePreferences = useUpdateAlertPreferences();
  const [localPrefs, setLocalPrefs] = useState<AlertPreferences | null>(null);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  if (isLoading || !localPrefs) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  function handleSave() {
    if (localPrefs) {
      updatePreferences.mutate(localPrefs);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Permit Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permit Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">Channels:</span>
            <Switch
              label="Email"
              checked={localPrefs.permitAlerts.email}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  permitAlerts: { ...localPrefs.permitAlerts, email: checked },
                })
              }
            />
            <Switch
              label="SMS"
              checked={localPrefs.permitAlerts.sms}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  permitAlerts: { ...localPrefs.permitAlerts, sms: checked },
                })
              }
            />
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">Notify me before permit expiry:</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Switch
              label="30 days"
              checked={localPrefs.permitAlerts.days30}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  permitAlerts: { ...localPrefs.permitAlerts, days30: checked },
                })
              }
            />
            <Switch
              label="14 days"
              checked={localPrefs.permitAlerts.days14}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  permitAlerts: { ...localPrefs.permitAlerts, days14: checked },
                })
              }
            />
            <Switch
              label="7 days"
              checked={localPrefs.permitAlerts.days7}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  permitAlerts: { ...localPrefs.permitAlerts, days7: checked },
                })
              }
            />
            <Switch
              label="1 day"
              checked={localPrefs.permitAlerts.days1}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  permitAlerts: { ...localPrefs.permitAlerts, days1: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Night Cap Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Night Cap Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">Channels:</span>
            <Switch
              label="Email"
              checked={localPrefs.nightCapAlerts.email}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  nightCapAlerts: { ...localPrefs.nightCapAlerts, email: checked },
                })
              }
            />
            <Switch
              label="SMS"
              checked={localPrefs.nightCapAlerts.sms}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  nightCapAlerts: { ...localPrefs.nightCapAlerts, sms: checked },
                })
              }
            />
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">Notify me at thresholds:</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Switch
              label="80% used"
              checked={localPrefs.nightCapAlerts.threshold80}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  nightCapAlerts: { ...localPrefs.nightCapAlerts, threshold80: checked },
                })
              }
            />
            <Switch
              label="90% used"
              checked={localPrefs.nightCapAlerts.threshold90}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  nightCapAlerts: { ...localPrefs.nightCapAlerts, threshold90: checked },
                })
              }
            />
            <Switch
              label="100% used"
              checked={localPrefs.nightCapAlerts.threshold100}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  nightCapAlerts: { ...localPrefs.nightCapAlerts, threshold100: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Regulatory Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">Channels:</span>
            <Switch
              label="Email"
              checked={localPrefs.regulatoryAlerts.email}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  regulatoryAlerts: { ...localPrefs.regulatoryAlerts, email: checked },
                })
              }
            />
            <Switch
              label="SMS"
              checked={localPrefs.regulatoryAlerts.sms}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  regulatoryAlerts: { ...localPrefs.regulatoryAlerts, sms: checked },
                })
              }
            />
          </div>
          <Separator />
          <Switch
            label="New regulatory changes"
            description="Get notified when new regulations affect your jurisdictions"
            checked={localPrefs.regulatoryAlerts.newChanges}
            onCheckedChange={(checked) =>
              setLocalPrefs({
                ...localPrefs,
                regulatoryAlerts: { ...localPrefs.regulatoryAlerts, newChanges: checked },
              })
            }
          />
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">Channels:</span>
            <Switch
              label="Email"
              checked={localPrefs.systemAlerts.email}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  systemAlerts: { ...localPrefs.systemAlerts, email: checked },
                })
              }
            />
            <Switch
              label="SMS"
              checked={localPrefs.systemAlerts.sms}
              onCheckedChange={(checked) =>
                setLocalPrefs({
                  ...localPrefs,
                  systemAlerts: { ...localPrefs.systemAlerts, sms: checked },
                })
              }
            />
          </div>
          <Separator />
          <Switch
            label="Sync failures"
            description="iCal feed sync errors and connection issues"
            checked={localPrefs.systemAlerts.syncFailures}
            onCheckedChange={(checked) =>
              setLocalPrefs({
                ...localPrefs,
                systemAlerts: { ...localPrefs.systemAlerts, syncFailures: checked },
              })
            }
          />
          <Switch
            label="Payment issues"
            description="Failed payments and billing problems"
            checked={localPrefs.systemAlerts.paymentIssues}
            onCheckedChange={(checked) =>
              setLocalPrefs({
                ...localPrefs,
                systemAlerts: { ...localPrefs.systemAlerts, paymentIssues: checked },
              })
            }
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updatePreferences.isPending}>
          {updatePreferences.isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </motion.div>
  );
}
