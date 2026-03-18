"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Mail, MoreHorizontal, Shield, Lock } from "lucide-react";
import { InviteMemberModal } from "@/components/team/invite-member-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/src/contexts/user-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@nexus.dev",
    role: "Admin",
    department: "Engineering",
    avatar: "/avatars/01.png",
    initials: "JD",
    status: "online",
    projects: 5,
    tasks: 12,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@nexus.dev",
    role: "Designer",
    department: "Design",
    avatar: "/avatars/02.png",
    initials: "SC",
    status: "online",
    projects: 3,
    tasks: 8,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@nexus.dev",
    role: "Developer",
    department: "Engineering",
    avatar: "/avatars/03.png",
    initials: "MJ",
    status: "away",
    projects: 4,
    tasks: 15,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@nexus.dev",
    role: "Developer",
    department: "Engineering",
    avatar: "/avatars/04.png",
    initials: "ED",
    status: "online",
    projects: 3,
    tasks: 10,
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@nexus.dev",
    role: "DevOps",
    department: "Engineering",
    avatar: "/avatars/05.png",
    initials: "DK",
    status: "offline",
    projects: 2,
    tasks: 6,
  },
  {
    id: "6",
    name: "Lisa Wang",
    email: "lisa@nexus.dev",
    role: "Product Manager",
    department: "Product",
    avatar: "/avatars/06.png",
    initials: "LW",
    status: "online",
    projects: 6,
    tasks: 4,
  },
  {
    id: "7",
    name: "Tom Wilson",
    email: "tom@nexus.dev",
    role: "Marketing",
    department: "Marketing",
    avatar: "/avatars/07.png",
    initials: "TW",
    status: "away",
    projects: 2,
    tasks: 5,
  },
  {
    id: "8",
    name: "Anna Martinez",
    email: "anna@nexus.dev",
    role: "QA Engineer",
    department: "Engineering",
    avatar: "/avatars/08.png",
    initials: "AM",
    status: "online",
    projects: 4,
    tasks: 9,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "away":
      return "bg-yellow-500";
    case "offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "Admin":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "Designer":
      return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
    case "Developer":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "DevOps":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    case "Product Manager":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Marketing":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400";
    case "QA Engineer":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export default function TeamPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isAdmin } = useUser();

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout title="Team">
      <div className="space-y-6">
        {/* Admin Notice for Members */}
        {!isAdmin && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              You are viewing the team as a member. Some management features are
              only available to admins.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {isAdmin && (
            <Button onClick={() => setIsInviteModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>

        {/* Team Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">
                {teamMembers.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">
                {teamMembers.filter((m) => m.status === "online").length}
              </p>
              <p className="text-sm text-muted-foreground">Online Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">Departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden transition-colors hover:bg-muted/50"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${getStatusColor(
                        member.status,
                      )}`}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Send message</DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuItem>Assign to project</DropdownMenuItem>
                          <DropdownMenuItem>Change role</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Remove from team
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.department}
                    </p>
                  </div>

                  <Badge
                    variant="secondary"
                    className={getRoleBadgeVariant(member.role)}
                  >
                    {member.role}
                  </Badge>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="flex items-center gap-4 pt-2 text-sm">
                    <div>
                      <span className="font-medium text-foreground">
                        {member.projects}
                      </span>
                      <span className="text-muted-foreground"> projects</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        {member.tasks}
                      </span>
                      <span className="text-muted-foreground"> tasks</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-foreground">
              No team members found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or invite new members
            </p>
          </div>
        )}
      </div>

      <InviteMemberModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </DashboardLayout>
  );
}
