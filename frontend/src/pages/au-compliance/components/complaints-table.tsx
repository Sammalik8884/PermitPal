import { useState } from "react";
import { MoreHorizontal, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { AuComplaint } from "@/lib/mock-data";

interface ComplaintsTableProps {
  complaints: AuComplaint[];
  onUpdateComplaint: (complaint: AuComplaint) => void;
}

export function ComplaintsTable({ complaints, onUpdateComplaint }: ComplaintsTableProps) {
  const typeConfig: Record<string, { label: string; color: string }> = {
    noise: { label: "Noise", color: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400" },
    neighbour: { label: "Neighbour", color: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400" },
    parking: { label: "Parking", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" },
    council: { label: "Council", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" },
    waste: { label: "Waste", color: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400" },
    platform: { label: "Platform", color: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400" },
    other: { label: "Other", color: "bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400" },
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" },
    responded: { label: "Responded", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" },
    resolved: { label: "Resolved", color: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" },
    escalated: { label: "Escalated", color: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400" },
  };

  if (complaints.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No complaints recorded.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => {
            const type = typeConfig[complaint.type] || typeConfig["other"];
            const status = statusConfig[complaint.status] || statusConfig["open"];

            return (
              <TableRow key={complaint.id}>
                <TableCell className="text-sm whitespace-nowrap">
                  {formatDate(complaint.date)}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {complaint.propertyName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", type.color)}>
                    {type.label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[300px] truncate">
                  {complaint.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", status.color)}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdateComplaint(complaint)}>
                        Update Status
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
  );
}
