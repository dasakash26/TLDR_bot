import { Clock } from "lucide-react";
import { RecentThreadCard } from "./recent-thread-card";

type Thread = {
  id: string;
  name: string;
  folderName?: string;
  folderId: string;
  updatedAt: string | number | Date;
};

interface RecentThreadsListProps {
  threads: Thread[];
}

export function RecentThreadsList({ threads }: RecentThreadsListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          Recent Chats
        </div>
        <span className="text-[11px] text-muted-foreground">
          {threads.length} conversation{threads.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {threads.map((thread) => (
          <RecentThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}
