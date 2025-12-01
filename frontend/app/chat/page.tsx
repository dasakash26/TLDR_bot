"use client";

import { Suspense } from "react";
import { ChatArea } from "@/components/chat/chat-area";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatArea />
    </Suspense>
  );
}
