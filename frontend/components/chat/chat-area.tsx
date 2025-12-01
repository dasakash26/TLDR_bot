"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Paperclip,
  MoreHorizontal,
  Share,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useChat, useThread } from "@/hooks/use-chat";
import { Message } from "@/types";
import TextareaAutosize from "react-textarea-autosize";
import { MessageItem } from "@/components/chat/message-item";
import EmptyState from "@/components/chat/empty-state";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";

export function ChatArea() {
  const searchParams = useSearchParams();
  const threadId = searchParams.get("threadId");
  const { data: thread, isLoading: isThreadLoading } = useThread(
    threadId || ""
  );
  const { sendMessage, isStreaming } = useChat(threadId || "");

  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (thread?.messages) {
      setLocalMessages(thread.messages);
    }
  }, [thread?.messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isStreaming]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !threadId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "USER",
      content: input,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, userMessage]);
    setInput("");

    const aiMessageId = (Date.now() + 1).toString();
    setLocalMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        role: "AI",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);

    await sendMessage(
      input,
      (chunk) => {
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: msg.content + chunk } // Simple append, ideally handle full replacement or smarter merge
              : msg
          )
        );
      },
      (citations) => {
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, citations: citations } : msg
          )
        );
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!threadId) {
    return <EmptyState />;
  }

  if (isThreadLoading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Chat Header */}
      <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <div className="w-px h-4 bg-border mx-1" />
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-none tracking-tight">
              {thread?.name || "Chat"}
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">
              Thread
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <ModeToggle />
        </div>
      </header>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-full flex flex-col">
          {localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-8 pb-4">
              {localMessages.map((msg, index) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  isStreaming={
                    isStreaming &&
                    index === localMessages.length - 1 &&
                    msg.role === "AI"
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border shadow-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 pb-6 bg-linear-to-t from-background via-background to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex flex-col gap-2 p-2 rounded-[24px] border border-input bg-muted/40 shadow-sm focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring transition-all hover:border-ring/40">
            <div className="flex items-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 mb-0.5"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <TextareaAutosize
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-1 border-0 shadow-none focus:ring-0 focus:outline-none px-2 py-2.5 min-h-[40px] max-h-32 resize-none bg-transparent text-base placeholder:text-muted-foreground/60"
                disabled={isStreaming}
                minRows={1}
                maxRows={5}
              />

              <Button
                size="icon"
                onClick={handleSendMessage}
                className={cn(
                  "h-9 w-9 rounded-full shadow-sm transition-all duration-200 mb-0.5",
                  input.trim()
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                disabled={!input.trim() || isStreaming}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
              AI-Generated Content • Verify Important Info
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
