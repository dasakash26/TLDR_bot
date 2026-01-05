"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFolderThreads, useFolder, useCreateThread } from "@/hooks/use-chat";
import {
  FolderHeader,
  ThreadsSection,
  EmptyFolderState,
  FolderLoadingState,
} from ".";
import { toast } from "sonner";
import { ChatInput } from "../chat-input";
import { sendChatMessage } from "@/lib/chat-utils";
import { useQueryClient } from "@tanstack/react-query";
import { useFileSelection } from "@/hooks/use-file-selection";
import { FileMetadataDialog } from "../file-metadata-dialog";

export function FolderDetailView({ folderId }: { folderId: string }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const { selectedFileId, isFileViewOpen, closeFileView } = useFileSelection();

  const { data: folder, isLoading: isFolderLoading } = useFolder(folderId);
  const { data: threads = [], isLoading: isLoadingThreads } =
    useFolderThreads(folderId);
  const createThread = useCreateThread();

  if (!folderId) {
    return <EmptyFolderState />;
  }

  if (isFolderLoading) {
    return <FolderLoadingState />;
  }

  const handleThreadClick = (folderId: string, threadId: string) => {
    router.push(`/chat?threadId=${threadId}&folderId=${folderId}`);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const messageContent = input;
    setInput("");

    try {
      const response = await createThread.mutateAsync({
        folder_id: folderId,
        thread_name: messageContent.slice(0, 50),
      });

      if (response.id) {
        const threadId = response.id;

        try {
          await sendChatMessage(threadId, messageContent);
          queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
        } catch (error) {
          console.error("Failed to send message:", error);
        }

        router.push(`/chat?threadId=${response.id}&folderId=${folderId}`);
      }
    } catch (error) {
      toast.error("Failed to create thread", {
        description: (error as Error).message,
      });
      setInput(messageContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <FolderHeader folderId={folderId} folderName={folder?.name || "Folder"} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-6">
          <ThreadsSection
            folderId={folderId}
            threads={threads}
            isLoading={isLoadingThreads}
            onThreadClick={handleThreadClick}
          />
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="max-w-xl mx-auto">
          <ChatInput
            folderId={folderId}
            value={input}
            onChange={setInput}
            onSend={handleSendMessage}
            onKeyDown={handleKeyDown}
            disabled={createThread.isPending}
            placeholder="Start a new conversation..."
          />
        </div>
      </div>

      {/* File Metadata Dialog */}
      <FileMetadataDialog
        fileId={selectedFileId}
        open={isFileViewOpen}
        onOpenChange={closeFileView}
      />
    </div>
  );
}
