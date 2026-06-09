import { Calendar, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { FeedPreviewEvent } from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeedPreviewProps {
  events: FeedPreviewEvent[] | undefined;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// ─── Feed Preview ────────────────────────────────────────────────────────────

export function FeedPreview({ events, isLoading, onConfirm, onCancel }: FeedPreviewProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <LoadingSpinner size="default" />
          <p className="text-sm text-muted-foreground">Parsing iCal feed...</p>
        </div>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-4">
          <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No upcoming events found in this feed.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <h4 className="text-sm font-medium">
          Feed Preview — {events.length} upcoming event{events.length !== 1 ? "s" : ""}
        </h4>
      </div>

      <div className="space-y-2 max-h-[240px] overflow-y-auto">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-md bg-muted/50 text-sm"
          >
            <div className="space-y-0.5">
              <p className="font-medium">{event.summary}</p>
              <p className="text-xs text-muted-foreground">
                {event.startDate} → {event.endDate}
              </p>
            </div>
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {event.nightsCount} night{event.nightsCount !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          Total: {events.reduce((sum, e) => sum + e.nightsCount, 0)} nights
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm}>
            Looks Good — Save Feed
          </Button>
        </div>
      </div>
    </Card>
  );
}
