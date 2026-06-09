import { motion } from "framer-motion";
import { FileCheck, Moon, Scale, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { NotificationLog } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: NotificationLog;
  onMarkAsRead: (id: string) => void;
}

// ─── Icon Map ────────────────────────────────────────────────────────────────

function getNotificationIcon(type: string) {
  switch (type) {
    case "permit_expiry":
      return FileCheck;
    case "night_cap_warning":
      return Moon;
    case "regulatory_change":
      return Scale;
    default:
      return Bell;
  }
}

function getNotificationIconColor(type: string) {
  switch (type) {
    case "permit_expiry":
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400";
    case "night_cap_warning":
      return "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400";
    case "regulatory_change":
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);
  const iconColor = getNotificationIconColor(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50",
        !notification.isRead && "bg-primary/5 border-primary/20"
      )}
      onClick={() => {
        if (!notification.isRead) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      {/* Unread indicator */}
      <div className="relative flex-shrink-0">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-full", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        {!notification.isRead && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn("text-sm font-medium truncate", !notification.isRead && "font-semibold")}>
            {notification.subject}
          </h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
            {formatDate(notification.createdAt, "relative")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.body}
        </p>
      </div>
    </motion.div>
  );
}
