"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { sendChatMessage } from "@/lib/chat-utils";

export function useChatMessaging(threadId: string) {
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();

  const sendMessage = useCallback(
    async (
      message: string,
      onChunk: (chunk: string) => void,
      onCitation?: (citations: any[]) => void
    ) => {
      setIsStreaming(true);
      try {
        await sendChatMessage(threadId, message, onChunk, onCitation);
      } finally {
        setIsStreaming(false);
        queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
      }
    },
    [threadId, queryClient]
  );

  return { sendMessage, isStreaming };
}
