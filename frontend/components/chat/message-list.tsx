"use client";

import { MessageItem } from ".";
import { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-4">
      {messages.map((msg, index) => (
        <MessageItem
          key={msg.id}
          message={msg}
          isStreaming={
            isStreaming && index === messages.length - 1 && msg.role === "AI"
          }
        />
      ))}
    </div>
  );
}
