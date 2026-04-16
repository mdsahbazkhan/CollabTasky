"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  seenBy?: string[];
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

// ── WhatsApp-style tick marks ────────────────────────────────────────────────
function SingleTick() {
  return (
    <svg
      viewBox="0 0 16 11"
      fill="none"
      className="h-3.5 w-3.5 text-muted-foreground"
      aria-hidden
    >
      <path
        d="M1 5.5L5.5 10L15 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleTick({ seen }: { seen: boolean }) {
  return (
    <svg
      viewBox="0 0 22 11"
      fill="none"
      className={cn(
        "h-3.5 w-3.5",
        seen ? "text-blue-400" : "text-muted-foreground",
      )}
      aria-hidden
    >
      <path
        d="M1 5.5L5.5 10L15 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 5.5L11.5 10L21 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageStatus({
  msg,
  currentUserId,
  otherUserId,
  onlineUsers,
}: {
  msg: Message;
  currentUserId: string;
  otherUserId: string;
  onlineUsers: string[];
}) {
  if (msg.sender?._id !== currentUserId) return null;
  const isSeen = msg.seenBy?.some(
    (id) => id.toString() === otherUserId.toString(),
  );
  const isDelivered = onlineUsers.includes(otherUserId.toString());
  if (isSeen) return <DoubleTick seen />;
  if (isDelivered) return <DoubleTick seen={false} />;
  return <SingleTick />;
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout title="Chat">
          <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
            Loading...
          </div>
        </DashboardLayout>
      }
    >
      <ChatContent />
    </Suspense>
  );
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, loading: userLoading } = useUser();
  const { projects, fetchProjects, loading: projectsLoading } = useProjects();
  const [allUsers, setAllUsers] = React.useState<ChatUser[]>([]);
  const [usersLoading, setUsersLoading] = React.useState(true);
  const [selectedChat, setSelectedChat] = React.useState<SelectedChat | null>(
    null,
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [typingUser, setTypingUser] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const typingTimeout = React.useRef<any>(null);
  const [onlineUsers, setOnlineUsers] = React.useState<string[]>([]);
  const [mobileChatListOpen, setMobileChatListOpen] = React.useState(false);
  const [unreadCounts, setUnreadCounts] = React.useState<
    Record<string, number>
  >({});
  const [showChatList, setShowChatList] = React.useState(true);

  React.useEffect(() => {
    if (userLoading) return;
    if (projects.length === 0) fetchProjects();
    setUsersLoading(true);
    getAllUsers()
      .then((data) => setAllUsers(data || []))
      .catch((err) => console.error("Failed to load users:", err))
      .finally(() => setUsersLoading(false));
  }, [userLoading]);

  React.useEffect(() => {
    if (userLoading) return;
    const userId = searchParams.get("userId");
    if (userId && allUsers.length > 0) {
      const user = allUsers.find((u) => u._id === userId);
      if (user) {
        selectDM(user);
        router.replace("/chat");
      }
    }
  }, [searchParams, allUsers, router, userLoading]);

  React.useEffect(() => {
    socket.connect();

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleTyping = ({ user }: { user: string }) => {
      if (user !== currentUser?.name) setTypingUser(user);
    };
    const handleStopTyping = () => setTypingUser("");
    const handleOnlineUsers = (users: string[]) => setOnlineUsers(users);
    const handleNewNotification = ({ senderId }: { senderId: string }) => {
      if (selectedChat?.data?._id !== senderId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };
    const handleMessagesSeen = ({
      conversationId,
      seenBy,
    }: {
      conversationId: string;
      seenBy: string;
    }) => {
      if (
        selectedChat?.type === "dm" &&
        selectedChat.conversationId === conversationId
      ) {
        setMessages((prev) =>
          prev.map((m) =>
            m.seenBy?.includes(seenBy)
              ? m
              : { ...m, seenBy: [...(m.seenBy || []), seenBy] },
          ),
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("newNotification", handleNewNotification);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("newNotification", handleNewNotification);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [selectedChat, currentUser?.name]);

  React.useEffect(() => {
    if (userLoading || !currentUser?._id) return;
    const handleConnect = () => {
      socket.emit("addUser", currentUser._id);
      socket.emit("getOnlineUsers");
    };
    if (socket.connected) handleConnect();
    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [currentUser?._id, userLoading]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getRoomId = (chat: SelectedChat) =>
    chat.type === "project" ? chat.data._id : chat.conversationId;

  const selectProject = async (project: Project) => {
    setShowChatList(false);
    setLoading(true);
    try {
      if (selectedChat) socket.emit("leaveRoom", getRoomId(selectedChat));
      setSelectedChat({ type: "project", data: project });
      const msgs = await getProjectMessages(project._id);
      setMessages(msgs || []);
      socket.emit("joinRoom", project._id);
      setUnreadCounts((prev) => ({ ...prev, [project._id]: 0 }));
    } catch (err) {
      console.error("Failed to load project messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const selectDM = async (user: ChatUser) => {
    setLoading(true);
    setShowChatList(false);
    try {
      if (selectedChat) socket.emit("leaveRoom", getRoomId(selectedChat));
      const conversation = await createConversation(user._id);
      setSelectedChat({
        type: "dm",
        data: user,
        conversationId: conversation._id,
      });
      const msgs = await getConversationMessages(conversation._id);
      setMessages(msgs || []);
      socket.emit("joinRoom", conversation._id);
      socket.emit("markSeen", {
        conversationId: conversation._id,
        userId: currentUser?._id,
      });
      setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }));
    } catch (err) {
      console.error("Failed to load DM:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTypingInput = (value: string) => {
    setInputMessage(value);
    if (!selectedChat || !currentUser) return;
    const roomId = getRoomId(selectedChat);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { roomId, user: currentUser.name });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId, user: currentUser.name });
      setIsTyping(false);
    }, 1000);
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
      receiverId:
        selectedChat.type === "dm" ? selectedChat.data._id : undefined,
    });
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Sidebar list ─────────────────────────────────────────────────────────
  // Rendered as a function (NOT a nested component) so React never remounts it
  const renderSidebarList = (onSelect?: () => void) => (
    <ScrollArea className="flex-1 px-2">
      <div className="py-2">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Project Channels
        </p>
        {projectsLoading ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">
            No projects yet
          </p>
        ) : (
          projects.map((project) => {
            const isSel =
              selectedChat?.type === "project" &&
              selectedChat.data._id === project._id;
            return (
              <button
                key={project._id}
                onClick={() => {
                  selectProject(project);
                  onSelect?.();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors",
                  isSel
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isSel ? "bg-primary text-primary-foreground" : "bg-accent",
                  )}
                >
                  <FolderKanban className="h-4 w-4" />
                </div>
                <span className="truncate font-medium">{project.name}</span>
                {unreadCounts[project._id] > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {unreadCounts[project._id]}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="mx-2 my-1 border-t border-border" />

      <div className="py-2">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Direct Messages
        </p>
        {usersLoading ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">Loading...</p>
        ) : allUsers.filter((u) => u._id !== currentUser?._id).length === 0 ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">
            No users found
          </p>
        ) : (
          allUsers
            .filter((u) => u._id !== currentUser?._id)
            .map((u) => {
              const isOnline = onlineUsers.includes(u._id.toString());
              const isSel =
                selectedChat?.type === "dm" && selectedChat.data._id === u._id;
              return (
                <button
                  key={u._id}
                  onClick={() => {
                    selectDM(u);
                    onSelect?.();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors",
                    isSel
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.avatar} alt={u.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {getInitials(u.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                        isOnline ? "bg-green-500" : "bg-zinc-600",
                      )}
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    <div className="flex flex-col items-start overflow-hidden">
                      <span
                        className={cn(
                          "truncate text-sm font-medium leading-tight",
                          isSel && "text-foreground",
                        )}
                      >
                        {u.name}
                      </span>
                      <span
                        className={cn(
                          "text-[11px]",
                          isOnline ? "text-green-500" : "text-muted-foreground",
                        )}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                    {unreadCounts[u._id] > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                        {unreadCounts[u._id]}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
        )}
      </div>
    </ScrollArea>
  );

  const isOtherOnline =
    selectedChat?.type === "dm" &&
    onlineUsers.includes(selectedChat.data._id.toString());

  return (
    <DashboardLayout title="Chat">
      {/* flex-col on mobile → flex-row on desktop (lg+) */}
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border">
        {/* ═══ Sidebar ═══════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "flex w-full flex-col bg-card",
            "lg:w-72 lg:border-r",
            showChatList ? "flex" : "hidden",
            "lg:flex",
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <span className="font-semibold text-foreground">Messages</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="h-9 rounded-lg border-0 bg-accent pl-9"
              />
            </div>
          </div>
          {renderSidebarList()}
        </div>

        {/* ═══ Main chat ═════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "flex flex-1 flex-col bg-background",
            showChatList ? "hidden lg:flex" : "flex",
          )}
        >
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-3">
              {/* {!showChatList && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 lg:hidden"
                  onClick={() => setShowChatList(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
              )} */}

              {selectedChat ? (
                <>
                  {selectedChat.type === "dm" ? (
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={selectedChat.data.avatar}
                          alt={selectedChat.data.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {getInitials(selectedChat.data.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                          isOtherOnline ? "bg-green-500" : "bg-zinc-600",
                        )}
                      />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                      <FolderKanban className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold leading-tight text-foreground">
                      {selectedChat.data.name}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        selectedChat.type === "dm" && isOtherOnline
                          ? "text-green-500"
                          : "text-muted-foreground",
                      )}
                    >
                      {selectedChat.type === "dm"
                        ? isOtherOnline
                          ? "Online"
                          : "Offline"
                        : "Project Channel"}
                    </p>
                  </div>
                </>
              ) : (
                <span className="font-semibold text-muted-foreground">
                  Select a chat
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 lg:hidden"
                onClick={() => setShowChatList((v) => !v)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              </Button> */}
              <Popover
                open={mobileChatListOpen}
                onOpenChange={setMobileChatListOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 lg:hidden"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <div className="flex flex-col bg-card">
                    <div className="flex h-12 items-center border-b border-border px-3">
                      <span className="font-semibold text-foreground">
                        Chats
                      </span>
                    </div>
                    <div className="flex h-[60vh] flex-col">
                      {renderSidebarList(() => setMobileChatListOpen(false))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto">
            {!selectedChat ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    No chat selected
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a project channel or direct message to start chatting
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">
                    Loading messages...
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    No messages yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Be the first to say something!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {messages.map((msg, index) => {
                  const isOwn = msg.sender?._id === currentUser?._id;
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const nextMsg =
                    index < messages.length - 1 ? messages[index + 1] : null;
                  const isFirstInGroup =
                    !prevMsg || prevMsg.sender?._id !== msg.sender?._id;
                  const isLastInGroup =
                    !nextMsg || nextMsg.sender?._id !== msg.sender?._id;
                  const otherUserId =
                    selectedChat?.type === "dm" ? selectedChat.data._id : "";

                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex items-end gap-2",
                        isOwn ? "flex-row-reverse" : "flex-row",
                        isFirstInGroup ? "mt-4" : "mt-0.5",
                      )}
                    >
                      {/* Avatar slot — always present to keep alignment */}
                      <div className="w-8 shrink-0">
                        {!isOwn && isLastInGroup && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={msg.sender?.avatar}
                              alt={msg.sender?.name}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                              {msg.sender?.name
                                ? getInitials(msg.sender.name)
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      <div
                        className={cn(
                          "flex max-w-[70%] flex-col",
                          isOwn ? "items-end" : "items-start",
                        )}
                      >
                        {/* Sender name — first received bubble in a group */}
                        {!isOwn && isFirstInGroup && (
                          <span className="mb-1 px-1 text-xs font-semibold text-foreground">
                            {msg.sender?.name}
                          </span>
                        )}

                        {/* Bubble */}
                        <div
                          className={cn(
                            "break-words px-3.5 py-2 text-sm leading-relaxed rounded-2xl",
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-card text-card-foreground",
                            // Flatten the inner corner for consecutive same-sender bubbles
                            isOwn && !isFirstInGroup && "rounded-tr-[6px]",
                            isOwn && !isLastInGroup && "rounded-br-[6px]",
                            !isOwn && !isFirstInGroup && "rounded-tl-[6px]",
                            !isOwn && !isLastInGroup && "rounded-bl-[6px]",
                          )}
                        >
                          {msg.text}
                        </div>

                        {/* Timestamp + tick (last bubble in group only) */}
                        {isLastInGroup && (
                          <div className="mt-1 flex items-center gap-1 px-1">
                            <span className="text-[11px] text-muted-foreground">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isOwn && selectedChat?.type === "dm" && (
                              <MessageStatus
                                msg={msg}
                                currentUserId={currentUser!._id}
                                otherUserId={otherUserId}
                                onlineUsers={onlineUsers}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Typing indicator */}
          {typingUser && (
            <div className="flex items-center gap-2 px-5 pb-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
              <p className="text-xs italic text-muted-foreground">
                {typingUser} is typing...
              </p>
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-border bg-card p-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border border-border bg-background px-2 py-1",
                !selectedChat && "opacity-60",
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                disabled={!selectedChat}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder={
                  selectedChat
                    ? selectedChat.type === "project"
                      ? `Message #${selectedChat.data.name}...`
                      : `Message ${selectedChat.data.name}...`
                    : "Select a chat first..."
                }
                value={inputMessage}
                onChange={(e) => handleTypingInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!selectedChat}
                className="flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                disabled={!selectedChat}
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg"
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
