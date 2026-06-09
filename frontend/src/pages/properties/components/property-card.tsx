import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  Castle,
  Hotel,
  TreePine,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn, truncate } from "@/lib/utils";
import type { Property, PropertyType } from "@/types";
import type { LucideIcon } from "lucide-react";

// ─── Property Type Config ────────────────────────────────────────────────────

const propertyTypeConfig: Record<PropertyType, { icon: LucideIcon; label: string; color: string }> = {
  apartment: { icon: Building2, label: "Apartment", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  house: { icon: Home, label: "House", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  villa: { icon: Castle, label: "Villa", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  condo: { icon: Hotel, label: "Condo", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  cabin: { icon: TreePine, label: "Cabin", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  other: { icon: Building2, label: "Other", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
};

export { propertyTypeConfig };

// ─── Compliance Score Circle ─────────────────────────────────────────────────

function ComplianceScoreCircle({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const radius = size === "lg" ? 28 : 16;
  const strokeWidth = size === "lg" ? 4 : 3;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  const getColor = (s: number) => {
    if (s > 70) return "text-green-500";
    if (s > 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getTrackColor = (s: number) => {
    if (s > 70) return "text-green-100 dark:text-green-900/30";
    if (s > 40) return "text-yellow-100 dark:text-yellow-900/30";
    return "text-red-100 dark:text-red-900/30";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={getTrackColor(score)}
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={getColor(score)}
        />
      </svg>
      <span className={cn(
        "absolute font-bold tabular-nums",
        size === "lg" ? "text-lg" : "text-[10px]",
        getColor(score)
      )}>
        {score}
      </span>
    </div>
  );
}

export { ComplianceScoreCircle };

// ─── Property Card ───────────────────────────────────────────────────────────

interface PropertyCardProps {
  property: Property;
  index: number;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertyCard({ property, index, onEdit, onDelete }: PropertyCardProps) {
  const navigate = useNavigate();
  const typeConfig = propertyTypeConfig[property.propertyType];
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="group relative p-5 rounded-xl border transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer"
        onClick={() => navigate(`/properties/${property.id}`)}
      >
        {/* Top: Type icon + Name + Actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", typeConfig.color)}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm leading-tight truncate">{property.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {truncate(`${property.address}, ${property.city}`, 40)}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => navigate(`/properties/${property.id}`)}>
                <Eye className="h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(property)}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(property)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Middle: Jurisdiction */}
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] font-normal">
            {typeConfig.label}
          </Badge>
          <span className="text-xs text-muted-foreground truncate">
            {property.city}, {property.countryCode}
          </span>
        </div>

        {/* Bottom: Compliance + Status */}
        <div className="mt-4 flex items-center justify-between">
          <ComplianceScoreCircle score={property.complianceScore} />
          <div className="flex items-center gap-1.5">
            <StatusBadge
              status={property.complianceStatus === "unknown" ? "pending" : property.complianceStatus}
              showTooltip={false}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
