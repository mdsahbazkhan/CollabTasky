"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderKanban,
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
import { useUser } from "@/src/contexts/user-context";
import { useProjects, Project } from "@/src/contexts/project-context";
import { getAllUsers } from "@/src/services/auth.service";
import {
  getProjectMessages,
  getConversationMessages,
  createConversation,
} from "@/src/services/chat.service";
import { socket } from "@/src/lib/socket";

interface ChatUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  text: string;
  createdAt: string;
}

type SelectedChat =
  | { type: "project"; data: Project }
  | { type: "dm"; data: ChatUser; conversationId: string };

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatPage() {
  const { user: currentUser } = useUser();
  const { projects, fetchProjects } = useProjects();
  const [allUsers, setAllUsers] = React.useState<ChatUser[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<SelectedChat | null>(
    null
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Load projects (via context) and all users on mount
  React.useEffect(() => {
    if (projects.length === 0) fetchProjects();
    getAllUsers()
      .then((data) => setAllUsers(data || []))
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  // Socket setup
  React.useEffect(() => {
    socket.connect();
    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, []);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getRoomId = (chat: SelectedChat) =>
    chat.type === "project" ? chat.data._id : chat.conversationId;

  const selectProject = async (project: Project) => {
    setLoading(true);
    try {
      if (selectedChat) socket.emit("leaveRoom", getRoomId(selectedChat));
      setSelectedChat({ type: "project", data: project });
      const msgs = await getProjectMessages(project._id);
      setMessages(msgs || []);
      socket.emit("joinRoom", project._id);
    } catch (err) {
      console.error("Failed to load project messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const selectDM = async (user: ChatUser) => {
    setLoading(true);
    try {
      if (selectedChat) socket.emit("leaveRoom", getRoomId(selectedChat));
      const conversation = await createConversation(user._id);
      setSelectedChat({ type: "dm", data: user, conversationId: conversation._id });
      const msgs = await getConversationMessages(conversation._id);
      setMessages(msgs || []);
      socket.emit("joinRoom", conversation._id);
    } catch (err) {
      console.error("Failed to load DM:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedChat || !currentUser) return;
    const roomId = getRoomId(selectedChat);
    socket.emit("sendMessage", {
      sender: currentUser._id,
      text: inputMessage.trim(),
      roomId,
      projectId:
        selectedChat.type === "project" ? selectedChat.data._id : undefined,
      conversationId:
        selectedChat.type === "dm" ? selectedChat.conversationId : undefined,
    });
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getChatTitle = () => {
    if (!selectedChat) return "Select a chat";
    return selectedChat.data.name;
  };

  return (
    <DashboardLayout title="Chat">
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border">
        {/* Sidebar */}
        <div className="hidden w-64 flex-col border-r border-border bg-card md:flex">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CollabTasky</span>
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
            {/* My Projects */}
            <div className="py-2">
              <div className="px-2 py-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  My Projects
                </span>
              </div>
              {projects.length === 0 ? (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  No projects yet
                </p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => selectProject(project)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                      selectedChat?.type === "project" &&
                        selectedChat.data._id === project._id
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <FolderKanban className="h-4 w-4 shrink-0" />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))
              )}
            </div>

            <Separator className="my-2" />

            {/* Direct Messages */}
            <div className="py-2">
              <div className="px-2 py-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Direct Messages
                </span>
              </div>
              {allUsers.filter((u) => u._id !== currentUser?._id).length === 0 ? (
                <p className="px-2 py-1 text-xs text-muted-foreground">
                  No users found
                </p>
              ) : (
                allUsers.filter((u) => u._id !== currentUser?._id).map((u) => (
                  <button
                    key={u._id}
                    onClick={() => selectDM(u)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                      selectedChat?.type === "dm" &&
                        selectedChat.data._id === u._id
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Avatar className="h-6 w-6 shrink-0">
                      <AvatarImage src={u.avatar} alt={u.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{u.name}</span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              {selectedChat?.type === "project" ? (
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              ) : (
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="font-semibold text-foreground">
                {getChatTitle()}
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
            {!selectedChat ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  Select a project or user to start chatting
                </p>
              </div>
            ) : loading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  No messages yet. Be the first to say something!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg._id} className="group flex gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage
                        src={msg.sender?.avatar}
                        alt={msg.sender?.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {msg.sender?.name ? getInitials(msg.sender.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {msg.sender?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={!selectedChat}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Input
                  placeholder={
                    selectedChat
                      ? selectedChat.type === "project"
                        ? `Message in ${selectedChat.data.name}...`
                        : `Message ${selectedChat.data.name}...`
                      : "Select a chat first..."
                  }
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!selectedChat}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  disabled={!selectedChat}
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <Button
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={!inputMessage.trim() || !selectedChat}
                onClick={sendMessage}
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
