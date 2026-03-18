"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Hash,
  Plus,
  Search,
  Send,
  Smile,
  Paperclip,
  Settings,
  Users,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Separator } from "@/components/ui/separator";

const channels = [
  { id: "1", name: "general", unread: 3, type: "channel" },
  { id: "2", name: "engineering", unread: 0, type: "channel" },
  { id: "3", name: "design", unread: 1, type: "channel" },
  { id: "4", name: "marketing", unread: 0, type: "channel" },
  { id: "5", name: "random", unread: 5, type: "channel" },
];

const directMessages = [
  { id: "1", name: "Sarah Chen", initials: "SC", status: "online", unread: 2 },
  {
    id: "2",
    name: "Mike Johnson",
    initials: "MJ",
    status: "online",
    unread: 0,
  },
  { id: "3", name: "Emily Davis", initials: "ED", status: "away", unread: 0 },
  { id: "4", name: "David Kim", initials: "DK", status: "offline", unread: 1 },
];

const messages = [
  {
    id: "1",
    user: { name: "Sarah Chen", initials: "SC", avatar: "/avatars/02.png" },
    content:
      "Hey team! Just pushed the latest design updates to the repo. Let me know what you think!",
    time: "9:30 AM",
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "🎉", count: 2 },
    ],
  },
  {
    id: "2",
    user: { name: "Mike Johnson", initials: "MJ", avatar: "/avatars/03.png" },
    content:
      "Looks great @Sarah! I especially like the new color scheme. The dark mode looks really polished.",
    time: "9:35 AM",
    reactions: [],
  },
  {
    id: "3",
    user: { name: "John Doe", initials: "JD", avatar: "/avatars/01.png" },
    content:
      "Agreed! Let's sync up this afternoon to discuss the implementation timeline. Does 2pm work for everyone?",
    time: "9:40 AM",
    reactions: [{ emoji: "✅", count: 4 }],
  },
  {
    id: "4",
    user: { name: "Emily Davis", initials: "ED", avatar: "/avatars/04.png" },
    content:
      "2pm works for me! I'll prepare the technical spec document before the meeting.",
    time: "9:45 AM",
    reactions: [],
  },
  {
    id: "5",
    user: { name: "Sarah Chen", initials: "SC", avatar: "/avatars/02.png" },
    content:
      "Perfect! I'll also share the Figma link so we can walk through the interactive prototypes together.",
    time: "9:50 AM",
    reactions: [{ emoji: "🙌", count: 2 }],
  },
  {
    id: "6",
    user: { name: "David Kim", initials: "DK", avatar: "/avatars/05.png" },
    content:
      "Quick question - are we planning to deploy this to staging first, or going straight to production?",
    time: "10:00 AM",
    reactions: [],
  },
  {
    id: "7",
    user: { name: "John Doe", initials: "JD", avatar: "/avatars/01.png" },
    content:
      "We'll deploy to staging first for QA review. Probably targeting production next week if everything looks good.",
    time: "10:05 AM",
    reactions: [{ emoji: "👍", count: 1 }],
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

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = React.useState(channels[0]);
  const [message, setMessage] = React.useState("");

  return (
    <DashboardLayout title="Chat">
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border">
        {/* Sidebar */}
        <div className="hidden w-64 flex-col border-r border-border bg-card md:flex">
          {/* Workspace Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                CollabTasky Team
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="h-8 pl-9 bg-muted"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-2">
            {/* Channels */}
            <div className="py-2">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Channels
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                    selectedChannel.id === channel.id
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <span className="truncate">{channel.name}</span>
                  {channel.unread > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-auto h-5 min-w-5 rounded-full bg-primary px-1.5 text-xs text-primary-foreground"
                    >
                      {channel.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            <Separator className="my-2" />

            {/* Direct Messages */}
            <div className="py-2">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Direct Messages
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {dm.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                        getStatusColor(dm.status),
                      )}
                    />
                  </div>
                  <span className="truncate">{dm.name}</span>
                  {dm.unread > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-auto h-5 min-w-5 rounded-full bg-primary px-1.5 text-xs text-primary-foreground"
                    >
                      {dm.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Channel Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {selectedChannel.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="group flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {msg.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {msg.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{msg.content}</p>
                    {msg.reactions.length > 0 && (
                      <div className="flex gap-1 pt-1">
                        {msg.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs hover:bg-muted/80"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-muted-foreground">
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Input
                  placeholder={`Message #${selectedChannel.name}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
