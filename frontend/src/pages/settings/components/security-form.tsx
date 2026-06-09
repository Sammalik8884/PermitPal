import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Globe, Shield, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PasswordStrength } from "@/components/password-strength";
import {
  useChangePassword,
  useActiveSessions,
  useRevokeSession,
  useRevokeAllSessions,
} from "@/hooks/use-settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDate } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

// ─── Device Icon ─────────────────────────────────────────────────────────────

function getDeviceIcon(os: string) {
  if (os.includes("iOS") || os.includes("Android")) return Smartphone;
  if (os.includes("Windows") || os.includes("macOS") || os.includes("Linux")) return Monitor;
  return Globe;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SecurityForm() {
  const changePassword = useChangePassword();
  const { data: sessions, isLoading: sessionsLoading } = useActiveSessions();
  const revokeSession = useRevokeSession();
  const revokeAll = useRevokeAllSessions();
  const [watchedPassword, setWatchedPassword] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  function onSubmit(data: PasswordFormData) {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => reset() }
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword", {
                  onChange: (e) => setWatchedPassword(e.target.value),
                })}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">{errors.newPassword.message}</p>
              )}
              {watchedPassword && <PasswordStrength password={watchedPassword} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={changePassword.isPending}>
                {changePassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Status: Not enabled</p>
              <p className="text-xs text-muted-foreground mt-1">
                Two-factor authentication adds an extra layer of security.
              </p>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Active Sessions</CardTitle>
            <CardDescription>Manage your active sessions across devices.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => revokeAll.mutate()}
            disabled={revokeAll.isPending}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out All
          </Button>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-3">
              {sessions?.map((session) => {
                const DeviceIcon = getDeviceIcon(session.os);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {session.browser} · {session.os}
                          </p>
                          {session.isCurrent && (
                            <Badge variant="success" size="sm">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session.ip} · {session.location} · {formatDate(session.lastActiveAt, "relative")}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => revokeSession.mutate(session.id)}
                        disabled={revokeSession.isPending}
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />
    </motion.div>
  );
}
