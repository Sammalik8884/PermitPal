import { useState } from "react";
import { Rss, Eye } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedPreview } from "./feed-preview";
import { useCreateFeed, usePreviewFeed } from "@/hooks/use-night-caps";
import { useProperties } from "@/hooks/use-properties";
import toast from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface AddFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPropertyId?: string;
}

// ─── Add Feed Dialog ─────────────────────────────────────────────────────────

export function AddFeedDialog({ open, onOpenChange, defaultPropertyId }: AddFeedDialogProps) {
  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? "");
  const [feedUrl, setFeedUrl] = useState("");
  const [source, setSource] = useState<"airbnb" | "vrbo" | "booking" | "other">("airbnb");
  const [label, setLabel] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const createFeed = useCreateFeed();
  const { data: previewEvents, isLoading: previewLoading } = usePreviewFeed(previewUrl);
  const { data: propertiesData } = useProperties();
  const properties = propertiesData ?? [];

  function handlePreview() {
    if (feedUrl.length > 10) {
      setPreviewUrl(feedUrl);
      setShowPreview(true);
    }
  }

  function handleSubmit() {
    if (!propertyId) {
      toast.error("Please select a property first.");
      return;
    }
    if (!label) {
      toast.error("Please enter a label for this feed.");
      return;
    }
    if (!feedUrl) {
      toast.error("Please enter a valid feed URL.");
      return;
    }

    createFeed.mutate(
      { propertyId, feedUrl, source, label },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      }
    );
  }

  function resetForm() {
    setPropertyId(defaultPropertyId ?? "");
    setFeedUrl("");
    setSource("airbnb");
    setLabel("");
    setShowPreview(false);
    setPreviewUrl(undefined);
  }

  function handleCancel() {
    resetForm();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            Add iCal Feed
          </DialogTitle>
          <DialogDescription>
            Connect a booking platform calendar to automatically track nights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Property Select */}
          <div className="space-y-2">
            <Label>Property</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Feed URL */}
          <div className="space-y-2">
            <Label htmlFor="feed-url">Feed URL</Label>
            <Input
              id="feed-url"
              placeholder="https://www.airbnb.com/calendar/ical/..."
              value={feedUrl}
              onChange={(e) => {
                setFeedUrl(e.target.value);
                setShowPreview(false);
                setPreviewUrl(undefined);
              }}
            />
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label>Source</Label>
            <Select value={source} onValueChange={(v) => setSource(v as typeof source)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="vrbo">VRBO</SelectItem>
                <SelectItem value="booking">Booking.com</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="feed-label">Label</Label>
            <Input
              id="feed-label"
              placeholder="e.g., My Airbnb Calendar"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Preview Button */}
          {!showPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={feedUrl.length <= 10}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Feed Events
            </Button>
          )}

          {/* Feed Preview */}
          {showPreview && (
            <FeedPreview
              events={previewEvents}
              isLoading={previewLoading}
              onConfirm={handleSubmit}
              onCancel={() => {
                setShowPreview(false);
                setPreviewUrl(undefined);
              }}
            />
          )}
        </div>

        {!showPreview && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!propertyId || !feedUrl || !label || createFeed.isPending}
            >
              {createFeed.isPending ? "Saving..." : "Save Feed"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
