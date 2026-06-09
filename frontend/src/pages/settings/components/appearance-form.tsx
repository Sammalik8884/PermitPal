import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

type Theme = "light" | "dark" | "system";
type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
type SidebarDefault = "expanded" | "collapsed";

// ─── Component ───────────────────────────────────────────────────────────────

export function AppearanceForm() {
  const [theme, setTheme] = useState<Theme>("system");
  const [dateFormat, setDateFormat] = useState<DateFormat>("MM/DD/YYYY");
  const [sidebar, setSidebar] = useState<SidebarDefault>("expanded");
  const [currency, setCurrency] = useState("USD");

  function handleSave() {
    // In real app, persist to localStorage/API
    toast.success("Appearance preferences saved");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>Choose your preferred color scheme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light" as Theme, label: "Light", icon: Sun },
              { value: "dark" as Theme, label: "Dark", icon: Moon },
              { value: "system" as Theme, label: "System", icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                  theme === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Icon className={cn("h-6 w-6", theme === value ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", theme === value ? "text-primary" : "text-muted-foreground")}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sidebar</CardTitle>
          <CardDescription>Default sidebar state on page load.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "expanded" as SidebarDefault, label: "Expanded" },
              { value: "collapsed" as SidebarDefault, label: "Collapsed" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSidebar(value)}
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg border-2 transition-all text-sm font-medium",
                  sidebar === value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date Format */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Date Format</CardTitle>
          <CardDescription>How dates are displayed throughout the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Preferred Format</Label>
            <select
              id="dateFormat"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value as DateFormat)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (International)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Currency Display</CardTitle>
          <CardDescription>Default currency for billing and financial displays.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CHF">CHF (Fr.)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </motion.div>
  );
}
