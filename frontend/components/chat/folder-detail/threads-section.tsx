"use client";

import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Thread } from "@/types";

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
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Chat Threads
      </h2>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : threads.length > 0 ? (
        <div className="space-y-2">
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onClick={() => onThreadClick(thread.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No threads yet. Create one to start chatting." />
      )}
    </section>
  );
}

interface ThreadCardProps {
  thread: Thread;
  onClick: () => void;
}

function ThreadCard({ thread, onClick }: ThreadCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{thread.name}</h3>
            <p className="text-xs text-muted-foreground">
              Updated{" "}
              {formatDistanceToNow(new Date(thread.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {thread.messages?.length || 0} messages
        </div>
      </div>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
      {message}
    </div>
  );
}
