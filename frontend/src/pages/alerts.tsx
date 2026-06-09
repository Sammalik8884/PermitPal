import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Clock, Globe2, ShieldAlert, FileWarning, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { apiGet, apiPut } from "@/lib/api";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export interface NotificationDto {
  id: string;
  alertType: string;
  channel: string;
  subject: string | null;
  body: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

export default function AlertsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiGet<{ data: NotificationDto[] }>("/notifications?pageSize=50"),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => apiPut(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => apiPut(`/notifications/read-all`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const alerts = data?.data || [];
  const unreadCount = alerts.filter(a => a.status === "Sent").length;

  const getIcon = (type: string) => {
    switch (type) {
      case "PermitExpiry":
        return <ShieldAlert style={{ width: "24px", height: "24px", color: "#c13515" }} />;
      case "NightCap":
      case "LevyDue":
      case "EuRegistration":
        return <Clock style={{ width: "24px", height: "24px", color: "#b25c00" }} />;
      case "RegulatoryChange":
        return <Globe2 style={{ width: "24px", height: "24px", color: "#006a70" }} />;
      default:
        return <AlertCircle style={{ width: "24px", height: "24px", color: "#222222" }} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "PermitExpiry": return "#fff0ef";
      case "NightCap":
      case "LevyDue":
      case "EuRegistration": return "#fff8e6";
      case "RegulatoryChange": return "#e5f4f5";
      default: return "#f7f7f7";
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#222222", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
            Alerts
          </h1>
          <p style={{ fontSize: "16px", color: "#6a6a6a", margin: 0 }}>
            Regulatory changes and compliance notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#ffffff",
              color: "#222222",
              border: "1px solid #dddddd",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              opacity: markAllAsReadMutation.isPending ? 0.5 : 1
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "#222222"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "#dddddd"}
          >
            <Check style={{ width: "16px", height: "16px" }} />
            Mark all as read
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No alerts"
          description="You'll receive notifications here when there are regulatory changes, permit expirations, or compliance deadlines approaching."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {alerts.map((alert) => {
            const isRead = alert.status !== "Sent";
            return (
              <div
                key={alert.id}
                onClick={() => { if (!isRead) markAsReadMutation.mutate(alert.id); }}
                style={{
                  backgroundColor: isRead ? "#ffffff" : "#f0f4ff",
                  border: "1px solid",
                  borderColor: isRead ? "#ebebeb" : "#d0dfff",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  gap: "20px",
                  cursor: isRead ? "default" : "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  position: "relative"
                }}
              onMouseOver={(e) => {
                if (!isRead) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.08) 0px 4px 12px";
                }
              }}
              onMouseOut={(e) => {
                if (!isRead) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {!isRead && (
              <div style={{ position: "absolute", top: "24px", right: "24px", width: "8px", height: "8px", backgroundColor: "#006a70", borderRadius: "50%" }} />
            )}
            
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: getIconBg(alert.alertType),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {getIcon(alert.alertType)}
            </div>

              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#222222", margin: 0 }}>
                    {alert.subject || alert.alertType}
                  </h3>
                  <span style={{ fontSize: "14px", color: "#6a6a6a" }}>•</span>
                  <span style={{ fontSize: "14px", color: "#6a6a6a" }}>
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: "15px", color: "#4a4a4a", margin: "0 0 12px 0", lineHeight: 1.5, paddingRight: "24px" }}>
                  {alert.body}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
