import { RefreshCw, Trash2, Edit, AlertCircle, CheckCircle2, Rss } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, truncate } from "@/lib/utils";
import { useSyncFeed, useDeleteFeed } from "@/hooks/use-night-caps";
import type { MockICalFeed } from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeedListProps {
  feeds: MockICalFeed[];
  onEdit?: (feed: MockICalFeed) => void;
  onAddFeed: () => void;
}

// ─── Source Badge Colors ─────────────────────────────────────────────────────

const sourceBadgeStyles: Record<string, string> = {
  airbnb: "bg-[#FF5A5F]/10 text-[#FF5A5F] border-[#FF5A5F]/30",
  vrbo: "bg-[#3B5998]/10 text-[#3B5998] border-[#3B5998]/30",
  booking_com: "bg-[#003580]/10 text-[#003580] border-[#003580]/30",
  other: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30",
};

const sourceLabels: Record<string, string> = {
  airbnb: "Airbnb",
  vrbo: "VRBO",
  booking_com: "Booking.com",
  other: "Other",
};

// ─── Feed List ───────────────────────────────────────────────────────────────

export function FeedList({ feeds, onEdit, onAddFeed }: FeedListProps) {
  const syncFeed = useSyncFeed();
  const deleteFeed = useDeleteFeed();

  if (feeds.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Rss className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h4 className="text-sm font-medium mb-1">No iCal Feeds</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Connect your booking platform calendars to automatically track nights.
        </p>
        <Button size="sm" onClick={onAddFeed}>
          Add Feed
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {feeds.map((feed) => (
        <Card key={feed.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium truncate">{feed.label}</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    sourceBadgeStyles[feed.source] ?? sourceBadgeStyles.other
                  )}
                >
                  {sourceLabels[feed.source] ?? "Other"}
                </Badge>
                {!feed.isActive && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono truncate">
                {truncate(feed.feedUrl, 60)}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {feed.lastSyncAt && (
                  <span className="flex items-center gap-1">
                    {feed.lastSyncStatus === "success" ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                    Last sync: {formatDate(feed.lastSyncAt, "relative")}
                  </span>
                )}
                {feed.syncErrorMessage && (
                  <span className="text-red-500 text-[11px]">
                    {truncate(feed.syncErrorMessage, 50)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => syncFeed.mutate(feed.id)}
                disabled={syncFeed.isPending}
                title="Sync Now"
              >
                <RefreshCw
                  className={cn(
                    "h-3.5 w-3.5",
                    syncFeed.isPending && "animate-spin"
                  )}
                />
              </Button>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onEdit(feed)}
                  title="Edit"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => deleteFeed.mutate(feed.id)}
                disabled={deleteFeed.isPending}
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
