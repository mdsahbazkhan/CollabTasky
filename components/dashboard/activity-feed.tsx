"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/src/lib/utils";

const activities = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: "/avatars/02.png", initials: "SC" },
    action: "completed task",
    target: "Update landing page",
    time: "2 minutes ago",
    type: "task",
  },
  {
    id: 2,
    user: { name: "Mike Johnson", avatar: "/avatars/03.png", initials: "MJ" },
    action: "commented on",
    target: "API Integration",
    time: "15 minutes ago",
    type: "comment",
  },
  {
    id: 3,
    user: { name: "Emily Davis", avatar: "/avatars/04.png", initials: "ED" },
    action: "created project",
    target: "Q2 Marketing",
    time: "1 hour ago",
    type: "project",
  },
  {
    id: 4,
    user: { name: "David Kim", avatar: "/avatars/05.png", initials: "DK" },
    action: "moved task to",
    target: "In Progress",
    time: "2 hours ago",
    type: "task",
  },
  {
    id: 5,
    user: { name: "Lisa Wang", avatar: "/avatars/06.png", initials: "LW" },
    action: "assigned you to",
    target: "Design Review",
    time: "3 hours ago",
    type: "assignment",
  },
  {
    id: 6,
    user: { name: "John Doe", avatar: "/avatars/01.png", initials: "JD" },
    action: "uploaded file to",
    target: "Website Redesign",
    time: "5 hours ago",
    type: "file",
  },
];

function getActivityColor(type: string) {
  switch (type) {
    case "task":
      return "bg-emerald-500";
    case "comment":
      return "bg-blue-500";
    case "project":
      return "bg-purple-500";
    case "assignment":
      return "bg-amber-500";
    case "file":
      return "bg-cyan-500";
    default:
      return "bg-muted-foreground";
  }
}

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-6 pb-6">
            {activities.map((activity, idx) => (
              <div key={activity.id} className="relative flex gap-4">
                {/* Timeline line */}
                {idx !== activities.length - 1 && (
                  <div className="absolute left-5 top-10 h-full w-px bg-border" />
                )}

                {/* Avatar with indicator */}
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={activity.user.avatar}
                      alt={activity.user.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {activity.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
                      getActivityColor(activity.type),
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">
                      {activity.user.name}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>{" "}
                    <span className="font-medium text-foreground">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
