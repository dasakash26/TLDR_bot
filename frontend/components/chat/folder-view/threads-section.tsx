"use client";

import { useState } from "react";
import { Thread } from "@/types";
import { useUpdateThread, useDeleteThread } from "@/hooks/use-chat";
import {
  RenameDialog,
  DeleteAlert,
} from "@/components/chat/sidebar/generic-dialogs";
import { ThreadCard } from "./thread-card";
import { ThreadListSkeleton } from "./thread-list-skeleton";
import { EmptyThreadsState } from "./empty-threads-state";

interface ThreadsSectionProps {
  threads: Thread[];
  isLoading: boolean;
  onThreadClick: (threadId: string) => void;
}

export function ThreadsSection({
  threads,
  isLoading,
  onThreadClick,
}: ThreadsSectionProps) {
  const { mutate: updateThread } = useUpdateThread();
  const { mutate: deleteThread } = useDeleteThread();

  const [threadToRename, setThreadToRename] = useState<Thread | null>(null);
  const [newThreadName, setNewThreadName] = useState("");
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);

  const handleRenameThread = () => {
    if (
      threadToRename &&
      newThreadName &&
      newThreadName !== threadToRename.name
    ) {
      updateThread({
        thread_id: threadToRename.id,
        new_name: newThreadName,
      });
    }
    setThreadToRename(null);
  };

  const handleDeleteThread = () => {
    if (threadToDelete) {
      deleteThread(threadToDelete.id);
    }
    setThreadToDelete(null);
  };

  const handleRenameThreadOpen = (thread: Thread) => {
    setNewThreadName(thread.name);
    setThreadToRename(thread);
  };

  return (
    <>
      <section className="mb-8 ">
        <h6 className="text-lg font-semibold mb-4 flex items-center gap-2 opacity-80">
          Chat Threads
        </h6>

        {isLoading ? (
          <ThreadListSkeleton />
        ) : threads.length > 0 ? (
          <div className="space-y-2">
            {threads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                onClick={() => onThreadClick(thread.id)}
                onRename={() => handleRenameThreadOpen(thread)}
                onDelete={() => setThreadToDelete(thread)}
              />
            ))}
          </div>
        ) : (
          <EmptyThreadsState />
        )}
      </section>

      <RenameDialog
        open={!!threadToRename}
        title="Rename Chat"
        inputLabel="Name"
        inputId="thread-name"
        value={newThreadName}
        onValueChange={setNewThreadName}
        onOpenChange={(open) => !open && setThreadToRename(null)}
        onSave={handleRenameThread}
      />

      <DeleteAlert
        open={!!threadToDelete}
        title="Delete Chat?"
        description={`This will permanently delete the chat "${threadToDelete?.name}".`}
        onOpenChange={(open) => !open && setThreadToDelete(null)}
        onDelete={handleDeleteThread}
      />
    </>
  );
}
