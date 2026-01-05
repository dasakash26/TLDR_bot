"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChat, useThread } from "@/hooks/use-chat";
import { Message } from "@/types";
import { useFileSelection } from "@/hooks/use-file-selection";
import {
  EmptyState,
  ChatSkeleton,
  FileMetadataDialog,
  FolderDetailView,
  ChatHeader,
  MessageList,
  ChatInput,
  ScrollToBottomButton,
} from "@/components/chat";

export function ViewArea() {
  const searchParams = useSearchParams();
  const threadId = searchParams.get("threadId");
  const folderId = searchParams.get("folderId");

  console.log("[ViewArea] URL params:", { threadId, folderId });

  if (!threadId && folderId) {
    return <FolderDetailView folderId={folderId} />;
  }

  return <ThreadChatView folderId={folderId} threadId={threadId} />;
}

function ThreadChatView({
  folderId,
  threadId,
}: {
  folderId: string | null;
  threadId: string | null;
}) {
  const router = useRouter();
  const [isMessaging, setIsMessaging] = useState(false);
  const { data: thread, isLoading: isThreadLoading } = useThread(
    threadId || "",
    !isMessaging
  );
  const { sendMessage, isStreaming } = useChat(threadId || "");
  const { selectedFileId, isFileViewOpen, closeFileView } = useFileSelection();

  useEffect(() => {
    if (!isThreadLoading && threadId && !thread) {
      console.log("[ThreadChatView] Thread not found, redirecting...");
      if (folderId) {
        router.replace(`/chat?folderId=${folderId}`);
      } else {
        router.replace("/chat");
      }
    }
  }, [thread, isThreadLoading, threadId, folderId, router]);

  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastThreadIdRef = useRef<string | null>(null);
  const serverMessageHashRef = useRef<string>("");
  const optimisticIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!thread?.messages) return;

    const sortedServerMessages = [...thread.messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const messageHash = sortedServerMessages
      .map((m) => m.id + m.content)
      .join("|");

    if (threadId !== lastThreadIdRef.current) {
      setLocalMessages(sortedServerMessages);
      lastThreadIdRef.current = threadId;
      serverMessageHashRef.current = messageHash;
      setIsMessaging(false);
      optimisticIdsRef.current.clear();
      return;
    }

    if (isMessaging || isStreaming) return;

    if (messageHash !== serverMessageHashRef.current) {
      const optimisticIds = optimisticIdsRef.current;
      const serverIds = new Set(sortedServerMessages.map((m) => m.id));

      const finalMessages = sortedServerMessages.map((serverMsg) => {
        const localMsg = localMessages.find((m) => m.id === serverMsg.id);
        return localMsg && optimisticIds.has(localMsg.id)
          ? localMsg
          : serverMsg;
      });

      optimisticIds.forEach((id) => {
        if (!serverIds.has(id)) {
          optimisticIds.delete(id);
        }
      });

      setLocalMessages(finalMessages);
      serverMessageHashRef.current = messageHash;
    }
  }, [thread?.messages, threadId, isMessaging, isStreaming]);

  const scrollToBottom = (instant = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: instant ? "instant" : "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isStreaming]);

  useEffect(() => {
    if (thread?.messages && thread.messages.length > 0) {
      scrollToBottom(true);
    }
  }, [thread?.id]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !threadId) return;

    setIsMessaging(true);

    const userMessageId = `temp-user-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      role: "USER",
      content: input,
      createdAt: new Date().toISOString(),
    };

    optimisticIdsRef.current.add(userMessageId);
    setLocalMessages((prev) => [...prev, userMessage]);
    setInput("");

    const aiMessageId = `temp-ai-${Date.now()}`;
    optimisticIdsRef.current.add(aiMessageId);
    setLocalMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        role: "AI",
        content: "",
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      await sendMessage(
        input,
        (chunk) => {
          setLocalMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + chunk }
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
    } finally {
      setTimeout(() => setIsMessaging(false), 500);
    }
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
      <ChatHeader threadName={thread?.name} />

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-full flex flex-col">
          <MessageList messages={localMessages} isStreaming={isStreaming} />
        </div>
      </div>

      <ScrollToBottomButton show={showScrollButton} onClick={scrollToBottom} />

      <ChatInput
        folderId={folderId || thread?.folderId || ""}
        value={input}
        onChange={setInput}
        onSend={handleSendMessage}
        onKeyDown={handleKeyDown}
        disabled={isStreaming}
      />

      {/* File Metadata Dialog */}
      <FileMetadataDialog
        fileId={selectedFileId}
        open={isFileViewOpen}
        onOpenChange={closeFileView}
      />
    </div>
  );
}
