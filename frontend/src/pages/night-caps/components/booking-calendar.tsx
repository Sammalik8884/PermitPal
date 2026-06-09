import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  isBefore,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { MockBookedNight } from "@/lib/mock-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookingCalendarProps {
  bookedNights: MockBookedNight[];
  onDayClick?: (date: string) => void;
}

// ─── Source Colors ───────────────────────────────────────────────────────────

const sourceColors: Record<string, { bg: string; dot: string; label: string }> = {
  airbnb: { bg: "bg-[#FF5A5F]/20", dot: "bg-[#FF5A5F]", label: "Airbnb" },
  vrbo: { bg: "bg-[#3B5998]/20", dot: "bg-[#3B5998]", label: "VRBO" },
  booking_com: { bg: "bg-[#003580]/20", dot: "bg-[#003580]", label: "Booking.com" },
  manual: { bg: "bg-[#6B7280]/20", dot: "bg-[#6B7280]", label: "Manual" },
  other: { bg: "bg-[#8B5CF6]/20", dot: "bg-[#8B5CF6]", label: "Other" },
};

// ─── Booking Calendar ────────────────────────────────────────────────────────

export function BookingCalendar({ bookedNights, onDayClick }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const today = new Date();

  // Create a map of date -> booked night for quick lookup
  const bookedMap = new Map<string, MockBookedNight>();
  bookedNights.forEach((bn) => {
    bookedMap.set(bn.date, bn);
  });

  function getBookingForDay(day: Date): MockBookedNight | undefined {
    const dateStr = format(day, "yyyy-MM-dd");
    return bookedMap.get(dateStr);
  }

  return (
    <Card className="p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const booking = getBookingForDay(day);
          const inMonth = isSameMonth(day, currentMonth);
          const isPast = isBefore(day, today) && !isSameDay(day, today);
          const isCurrentDay = isToday(day);
          const sourceStyle = booking ? sourceColors[booking.source] ?? sourceColors.other : null;

          const dayCell = (
            <motion.button
              key={idx}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.005 }}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-md text-xs transition-colors",
                !inMonth && "text-muted-foreground/30",
                inMonth && !booking && "text-foreground hover:bg-muted",
                inMonth && isPast && !booking && "text-muted-foreground",
                booking && sourceStyle?.bg,
                isCurrentDay && "ring-2 ring-primary ring-offset-1",
                !booking && onDayClick && inMonth && "cursor-pointer",
                booking && "cursor-default"
              )}
              onClick={() => {
                if (!booking && onDayClick && inMonth) {
                  onDayClick(format(day, "yyyy-MM-dd"));
                }
              }}
              disabled={!inMonth}
            >
              <span>{format(day, "d")}</span>
              {booking && (
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                    sourceStyle?.dot
                  )}
                />
              )}
            </motion.button>
          );

          if (booking) {
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>{dayCell}</TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{booking.guestName ?? "Guest"}</p>
                  <p className="text-xs text-muted-foreground">
                    Source: {sourceColors[booking.source]?.label ?? "Unknown"}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return dayCell;
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
        {Object.entries(sourceColors).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={cn("w-2.5 h-2.5 rounded-full", value.dot)} />
            <span className="text-xs text-muted-foreground">{value.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
