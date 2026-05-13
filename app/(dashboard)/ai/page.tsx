"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@/src/contexts/user-context";
import {
  Sparkles,
  Send,
  Paperclip,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  FileText,
  Code,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { sendMessageToAI } from "@/src/services/ai.service";
import { AvatarImage } from "@radix-ui/react-avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI project assistant. How can I help you today?",
    timestamp: "Now",
  },
];
const suggestions = [
  { icon: Lightbulb, text: "Generate project ideas", color: "text-yellow-500" },
  { icon: FileText, text: "Write documentation", color: "text-blue-500" },
  { icon: Code, text: "Create code snippets", color: "text-green-500" },
  {
    icon: MessageSquare,
    text: "Summarize meeting notes",
    color: "text-purple-500",
  },
];

export default function AIAssistantPage() {
  const { user, loading, switchRole, isAdmin } = useUser();
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  const userAvatar = user?.avatar || "";
  const userName = user?.name || "Guest";
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentMessage = input;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsLoading(true);

    try {
      const res = await sendMessageToAI(currentMessage);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res?.data || "No response from AI",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);

      toast.error("Failed to copy");
    }
  };

  return (
    <DashboardLayout title="AI Assistant">
      <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-lg border border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/favicon.svg"
                alt="CollabTasky AI"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">CollabTasky AI</h2>
              <p className="text-xs text-muted-foreground">
                Your intelligent project assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              Online
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset conversation</span>
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 min-h-0" ref={scrollRef}>
          <div className="mx-auto flex min-h-full max-w-3xl flex-col space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse",
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  {message.role === "assistant" ? (
                    <AvatarFallback className="bg-primary">
                      <div className="relative h-4 w-4">
                        <Image
                          src="/favicon.svg"
                          alt="AI"
                          width={16}
                          height={16}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </AvatarFallback>
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Avatar>
                <div
                  className={cn(
                    "max-w-[80%] space-y-2",
                    message.role === "user" && "text-right",
                  )}
                >
                  <Card
                    className={cn(
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                  <div
                    className={cn(
                      "flex items-center gap-2 text-xs text-muted-foreground",
                      message.role === "user" && "justify-end",
                    )}
                  >
                    <span>{message.timestamp}</span>
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <Button
                          title="Copy response"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopy(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary">
                    <div className="relative h-4 w-4">
                      <Image
                        src="/favicon.svg"
                        alt="AI"
                        width={16}
                        height={16}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  <suggestion.icon
                    className={cn("h-4 w-4", suggestion.color)}
                  />
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-border p-4">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Ask me anything about your projects..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
