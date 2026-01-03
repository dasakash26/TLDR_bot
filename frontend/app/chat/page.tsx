"use client";

import { Suspense } from "react";
import { ChatArea, ChatSkeleton } from "@/components/chat";


export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatArea />
    </Suspense>
  );
}
