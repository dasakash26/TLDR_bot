"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import { toast } from "sonner";

/**
 * Hook for handling real-time chat messaging with SSE streaming
 */
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
        const response = await fetchClient(`/thread/${threadId}/chat`, {
          method: "POST",
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data: ")) continue;

            const dataStr = trimmedLine.slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.type === "message") {
                onChunk(data.content);
              } else if (data.type === "citation") {
                if (onCitation) onCitation(data.citations);
              } else if (data.type === "error") {
                toast.error(data.message);
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        toast.error("Failed to send message");
      } finally {
        setIsStreaming(false);
        // Invalidate thread to fetch the full saved message history
        queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
      }
    },
    [threadId, queryClient]
  );

  return { sendMessage, isStreaming };
}
