import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrganisation, useRemoveMember } from "@/hooks/use-settings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InviteMemberDialog } from "./invite-member-dialog";
import { formatDate, getInitials } from "@/lib/utils";

// ─── Role Badge Variant ──────────────────────────────────────────────────────

function getRoleBadgeVariant(role: string): "default" | "secondary" | "info" | "outline" {
  switch (role) {
    case "owner":
      return "default";
    case "admin":
      return "info";
    case "member":
      return "secondary";
    default:
      return "outline";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function TeamMembersList() {
  const { data: org, isLoading } = useOrganisation();
  const removeMember = useRemoveMember();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  if (isLoading || !org) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  function handleRemove(memberId: string) {
    if (removingId === memberId) {
      removeMember.mutate(memberId, {
        onSettled: () => setRemovingId(null),
      });
    } else {
      setRemovingId(memberId);
      // Auto-reset confirmation after 3s
      setTimeout(() => setRemovingId(null), 3000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Team Members</CardTitle>
          <Button size="sm" className="gap-2" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {org.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {getInitials(`${member.firstName} ${member.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)} size="sm" className="capitalize">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDate(member.joinedAt, "short")}
                  </TableCell>
                  <TableCell className="text-right">
                    {member.role !== "owner" && (
                      <Button
                        variant={removingId === member.id ? "destructive" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemove(member.id)}
                        disabled={removeMember.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </motion.div>
  );
}
