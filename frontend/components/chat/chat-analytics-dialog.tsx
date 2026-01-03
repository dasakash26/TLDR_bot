"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import type { Thread } from "@/types";

interface ChatAnalyticsDialogProps {
  thread: Thread | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatAnalyticsDialog({
  thread,
  open,
  onOpenChange,
}: ChatAnalyticsDialogProps) {
  const analytics = useMemo(() => {
    if (!thread?.messages || thread.messages.length === 0) {
      return null;
    }

    const userMessages = thread.messages.filter((m) => m.role === "USER");
    const aiMessages = thread.messages.filter((m) => m.role === "AI");

    const totalWords = thread.messages.reduce(
      (sum, msg) => sum + msg.content.split(/\s+/).filter(Boolean).length,
      0
    );

    const totalChars = thread.messages.reduce(
      (sum, msg) => sum + msg.content.length,
      0
    );

    const avgWordsPerMessage = Math.round(totalWords / thread.messages.length);

    const citationsCount = aiMessages.reduce(
      (sum, msg) => sum + (msg.citations?.length || 0),
      0
    );

    const avgCitationsPerResponse =
      aiMessages.length > 0
        ? (citationsCount / aiMessages.length).toFixed(1)
        : "0";

    return {
      totalMessages: thread.messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      totalWords,
      totalChars,
      avgWordsPerMessage,
      citationsCount,
      avgCitationsPerResponse,
    };
  }, [thread]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          title="Conversation analytics"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conversation Analytics</DialogTitle>
          <DialogDescription>
            Statistical insights for this conversation
          </DialogDescription>
        </DialogHeader>
        {analytics ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground font-medium">
                  Total Messages
                </p>
                <p className="text-2xl font-bold">{analytics.totalMessages}</p>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground font-medium">
                  Total Words
                </p>
                <p className="text-2xl font-bold">
                  {analytics.totalWords.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-primary/10">
                <p className="text-xs text-muted-foreground font-medium">
                  Your Messages
                </p>
                <p className="text-2xl font-bold text-primary">
                  {analytics.userMessages}
                </p>
              </div>
              <div className="space-y-2 p-3 rounded-lg bg-primary/10">
                <p className="text-xs text-muted-foreground font-medium">
                  AI Responses
                </p>
                <p className="text-2xl font-bold text-primary">
                  {analytics.aiMessages}
                </p>
              </div>
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Avg Words/Message
                </span>
                <span className="text-sm font-semibold">
                  {analytics.avgWordsPerMessage}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Characters
                </span>
                <span className="text-sm font-semibold">
                  {analytics.totalChars.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Citations
                </span>
                <span className="text-sm font-semibold">
                  {analytics.citationsCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Avg Citations/Response
                </span>
                <span className="text-sm font-semibold">
                  {analytics.avgCitationsPerResponse}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No messages in this conversation yet
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
