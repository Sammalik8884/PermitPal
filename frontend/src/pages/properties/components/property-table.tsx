import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpDown, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComplianceScoreCircle, propertyTypeConfig } from "./property-card";
import { truncate } from "@/lib/utils";
import type { Property } from "@/types";
import type { PropertyFilters } from "@/hooks/use-properties";

// ─── Property Table ──────────────────────────────────────────────────────────

interface PropertyTableProps {
  properties: Property[];
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertyTable({ properties, filters, onFiltersChange, onEdit, onDelete }: PropertyTableProps) {
  const navigate = useNavigate();

  const handleSort = (column: "name" | "complianceScore" | "createdAt") => {
    const newOrder =
      filters.sortBy === column && filters.sortOrder === "asc" ? "desc" : "asc";
    onFiltersChange({ ...filters, sortBy: column, sortOrder: newOrder });
  };

  const SortButton = ({ column, children }: { column: "name" | "complianceScore" | "createdAt"; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=active]:text-foreground"
      onClick={() => handleSort(column)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-lg border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <SortButton column="name">Name</SortButton>
              </TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead className="hidden lg:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Jurisdiction</TableHead>
              <TableHead>
                <SortButton column="complianceScore">Compliance</SortButton>
              </TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => {
              const typeConfig = propertyTypeConfig[property.propertyType];
              return (
                <TableRow
                  key={property.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${typeConfig.color}`}>
                        <typeConfig.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate">{property.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {truncate(`${property.address}, ${property.city}`, 35)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {property.city}, {property.countryCode}
                  </TableCell>
                  <TableCell>
                    <ComplianceScoreCircle score={property.complianceScore} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <StatusBadge
                      status={property.complianceStatus === "unknown" ? "pending" : property.complianceStatus}
                      showTooltip={false}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
