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
  const { data: thread, isLoading: isThreadLoading } = useThread(
    threadId || ""
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
  const [localMessages, setLocalMessages] = useState<Message[]>(
    thread?.messages || []
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (thread?.messages && !isStreaming) {
      setLocalMessages(thread.messages);
    }
  }, [thread?.messages, isStreaming, threadId]);

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
