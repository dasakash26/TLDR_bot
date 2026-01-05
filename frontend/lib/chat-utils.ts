import { fetchClient } from "@/lib/api";
import { toast } from "sonner";

export async function sendChatMessage(
  threadId: string,
  message: string,
  onChunk?: (chunk: string) => void,
  onCitation?: (citations: any[]) => void
) {
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
            if (onChunk) onChunk(data.content);
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
    throw error;
  }
}
