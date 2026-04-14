"use client";

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
import {
  useProjects,
  ProjectMemberResponse,
} from "@/src/contexts/project-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { getTasksCountByUser } from "@/src/services/task.service";
import { getProjectsCountByUser } from "@/src/services/project.service";
import AddMemberModal from "@/components/projects/AddMemberModal";
import { getAllUsers } from "@/src/services/auth.service";
import { socket } from "@/src/lib/socket";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/contexts/user-context";

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
    case "admin":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "owner":
      return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
    case "member":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export default function TeamPage() {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getProjectById, projects, fetchProjects } = useProjects();
  const [projectMembers, setProjectMembers] = useState<ProjectMemberResponse[]>(
    [],
  );
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [memberStats, setMemberStats] = useState<
    Record<string, { tasks: number; projects: number }>
  >({});
  const [projectId, setProjectId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await fetchProjects();
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };
  const fetchUsers = async () => {
    const res = await getAllUsers();
    setUsers(res);
  };
  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [fetchProjects]);
  useEffect(() => {
    const id = localStorage.getItem("currentProjectId");
    setProjectId(id);
  }, []);
  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!projects.length) return;

      let currentProjectId = projectId;

      if (!currentProjectId && projects.length > 0) {
        currentProjectId = projects[0]._id;
      }

      if (currentProjectId) {
        try {
          const project = await getProjectById(currentProjectId);
          if (project) {
            setProjectMembers(project.members || []);
            setCurrentUserRole(project.role || null);
          }
        } catch (error) {
          console.error("Failed to fetch project:", error);
        }
      }

      setIsLoading(false);
    };

    fetchProjectMembers();
  }, [projects, projectId]);

  useEffect(() => {
    const fetchMemberStats = async () => {
      const stats: Record<string, { tasks: number; projects: number }> = {};

      for (const member of projectMembers) {
        const userId = member.user._id;
        try {
          const [taskCount, projectCount] = await Promise.all([
            getTasksCountByUser(userId),
            getProjectsCountByUser(userId),
          ]);
          stats[userId] = { tasks: taskCount, projects: projectCount };
        } catch (error) {
          stats[userId] = { tasks: 0, projects: 0 };
        }
      }
      setMemberStats(stats);
    };

    if (projectMembers.length > 0) {
      fetchMemberStats();
    }
  }, [projectMembers]);

  useEffect(() => {
    socket.connect();
    
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };
    
    socket.on("onlineUsers", handleOnlineUsers);
    
    if (currentUser?._id) {
      socket.emit("addUser", currentUser._id);
    }
    
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.disconnect();
    };
  }, [currentUser?._id]);

  const handleSendMessage = (userId: string) => {
    router.push(`/chat?userId=${userId}`);
  };

  const teamMembers = projectMembers.map((member) => ({
    id: member.user._id,
    name: member.user.name,
    email: member.user.email || "",
    role: member.role || "Member",
    department: "Engineering",
    avatar: "/avatars/01.png",
    initials: member.user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase(),
    status: onlineUsers.includes(member.user._id.toString()) ? "online" : "offline",
    projects: memberStats[member.user._id]?.projects || 0,
    tasks: memberStats[member.user._id]?.tasks || 0,
  }));

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout title="Team">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading team...</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {/* Admin Notice for Members */}
            {currentUserRole !== "owner" && currentUserRole !== "admin" && (
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Limited Access</AlertTitle>
                <AlertDescription>
                  You are viewing the team as a member. Some management features
                  are only available to admins.
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
              {(currentUserRole === "owner" || currentUserRole === "admin") && (
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMessage(member.id)}>
                            Send message
                          </DropdownMenuItem>
                          {currentUserRole === "owner" && (
                            <>
                              <DropdownMenuItem>
                                Assign to project
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
                          <span className="text-muted-foreground">
                            {" "}
                            projects
                          </span>
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

          {/* <InviteMemberModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      /> */}
          <AddMemberModal
            open={isInviteModalOpen}
            onOpenChange={setIsInviteModalOpen}
            projectId={projectId}
            users={users}
            refreshProject={fetchData}
          />
        </>
      )}
    </DashboardLayout>
  );
}
