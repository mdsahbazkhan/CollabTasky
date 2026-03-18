"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  MessageSquare,
  UserPlus,
  FolderKanban,
  AtSign,
  Bell,
  Check,
  Trash2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Notification {
  id: string;
  type: "task" | "comment" | "mention" | "project" | "team";
  title: string;
  description: string;
  time: string;
  read: boolean;
  user?: { name: string; initials: string; avatar?: string };
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "task",
    title: "Task assigned to you",
    description: "You've been assigned to 'Review pull request #42'",
    time: "2 minutes ago",
    read: false,
    user: { name: "Sarah Chen", initials: "SC" },
  },
  {
    id: "2",
    type: "mention",
    title: "You were mentioned",
    description: "@johndoe Can you review the latest designs?",
    time: "15 minutes ago",
    read: false,
    user: { name: "Mike Johnson", initials: "MJ" },
  },
  {
    id: "3",
    type: "comment",
    title: "New comment on your task",
    description: "Emily commented on 'Update API documentation'",
    time: "1 hour ago",
    read: false,
    user: { name: "Emily Davis", initials: "ED" },
  },
  {
    id: "4",
    type: "project",
    title: "Project status updated",
    description: "Website Redesign moved to 'In Progress'",
    time: "2 hours ago",
    read: true,
    user: { name: "David Kim", initials: "DK" },
  },
  {
    id: "5",
    type: "team",
    title: "New team member",
    description: "Anna Martinez joined the Engineering team",
    time: "3 hours ago",
    read: true,
    user: { name: "Anna Martinez", initials: "AM" },
  },
  {
    id: "6",
    type: "task",
    title: "Task completed",
    description: "Lisa marked 'Create marketing assets' as done",
    time: "5 hours ago",
    read: true,
    user: { name: "Lisa Wang", initials: "LW" },
  },
  {
    id: "7",
    type: "comment",
    title: "Reply to your comment",
    description: "Tom replied to your comment on 'Q2 Planning'",
    time: "1 day ago",
    read: true,
    user: { name: "Tom Wilson", initials: "TW" },
  },
];

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "task":
      return CheckCircle2;
    case "comment":
      return MessageSquare;
    case "mention":
      return AtSign;
    case "project":
      return FolderKanban;
    case "team":
      return UserPlus;
    default:
      return Bell;
  }
}

function getIconColor(type: Notification["type"]) {
  switch (type) {
    case "task":
      return "text-green-500 bg-green-100 dark:bg-green-900/30";
    case "comment":
      return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
    case "mention":
      return "text-purple-500 bg-purple-100 dark:bg-purple-900/30";
    case "project":
      return "text-orange-500 bg-orange-100 dark:bg-orange-900/30";
    case "team":
      return "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30";
    default:
      return "text-muted-foreground bg-muted";
  }
}

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = React.useState(notifications);

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredByType = (type: Notification["type"] | "all") => {
    if (type === "all") return notificationList;
    return notificationList.filter((n) => n.type === type);
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              All Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              All
              {notificationList.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notificationList.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {notificationList.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">
                    No notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {"You're all caught up!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              notificationList.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      !notification.read && "border-l-4 border-l-primary",
                    )}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          getIconColor(notification.type),
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-foreground">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          {notification.user && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={notification.user.avatar}
                                  alt={notification.user.name}
                                />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {notification.user.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {notification.user.name}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-2">
            {notificationList.filter((n) => !n.read).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">
                    All caught up!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    No unread notifications
                  </p>
                </CardContent>
              </Card>
            ) : (
              notificationList
                .filter((n) => !n.read)
                .map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <Card
                      key={notification.id}
                      className="border-l-4 border-l-primary transition-colors hover:bg-muted/50"
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                            getIconColor(notification.type),
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark read
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </TabsContent>

          <TabsContent value="mentions" className="space-y-2">
            {filteredByType("mention").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AtSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">
                    No mentions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {"You haven't been mentioned recently"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredByType("mention").map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      !notification.read && "border-l-4 border-l-primary",
                    )}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          getIconColor(notification.type),
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
