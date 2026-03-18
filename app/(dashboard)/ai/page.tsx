"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
    content:
      "Hello! I'm your AI project assistant. I can help you with task management, writing documentation, generating code snippets, brainstorming ideas, and more. How can I help you today?",
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
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponses: Record<string, string> = {
      project:
        "I'd be happy to help you generate project ideas! Based on current trends and your team's capabilities, here are some suggestions:\n\n1. **Customer Portal Redesign** - Modernize the customer-facing dashboard with improved UX\n2. **Internal Analytics Tool** - Build a custom analytics solution for better insights\n3. **API Gateway** - Create a unified API gateway for all microservices\n\nWould you like me to elaborate on any of these ideas?",
      documentation:
        "I can help you write comprehensive documentation. Please share:\n\n1. **Project/Feature Name** - What are we documenting?\n2. **Target Audience** - Who will read this?\n3. **Key Points** - What should be covered?\n\nOnce you provide these details, I'll generate a well-structured document for you.",
      code: "I'd be happy to help you with code! Please specify:\n\n1. **Programming Language** - TypeScript, Python, etc.\n2. **Framework** - React, Next.js, etc.\n3. **Functionality** - What should the code do?\n\nShare the details and I'll generate clean, well-documented code for you.",
      default:
        "That's a great question! I'm analyzing your request and preparing a detailed response. Based on your project context, here's what I recommend:\n\n1. **Break down the task** into smaller, manageable pieces\n2. **Set clear milestones** with deadlines\n3. **Assign responsibilities** to team members\n\nWould you like me to create a detailed action plan for this?",
    };

    const responseKey = input.toLowerCase().includes("project")
      ? "project"
      : input.toLowerCase().includes("documentation") ||
          input.toLowerCase().includes("doc")
        ? "documentation"
        : input.toLowerCase().includes("code")
          ? "code"
          : "default";

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponses[responseKey],
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
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

  return (
    <DashboardLayout title="AI Assistant">
      <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-lg border border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
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
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6 max-w-3xl mx-auto">
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
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      JD
                    </AvatarFallback>
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
                    <CardContent className="p-3">
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
                        <Button variant="ghost" size="icon" className="h-6 w-6">
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
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
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
        <div className="border-t border-border p-4">
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
