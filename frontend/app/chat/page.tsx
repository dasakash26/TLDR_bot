"use client";

import { Suspense } from "react";
import { ViewArea, ChatSkeleton } from "@/components/chat";


export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ViewArea />
    </Suspense>
  );
}
