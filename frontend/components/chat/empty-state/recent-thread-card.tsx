import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { listItemSlideVariant } from "@/lib/animation-variants";

interface Thread {
  id: string;
  name: string;
  folderId: string;
  folderName?: string;
  updatedAt: string | number | Date;
}

interface RecentThreadCardProps {
  thread: Thread;
}

export function RecentThreadCard({ thread }: RecentThreadCardProps) {
  return (
    <motion.div
      whileHover="hover"
      variants={listItemSlideVariant}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        key={thread.id}
        href={`/chat?threadId=${thread.id}&folderId=${thread.folderId}`}
        className="group"
      >
        <Card className="hover:bg-muted/40 transition-colors border-border/40 shadow-none hover:border-border/50 rounded-xl">
          <CardHeader className="px-3 py-2">
            <CardTitle className="text-[13px] font-medium flex items-start justify-between gap-2">
              <span className="truncate leading-tight">{thread.name}</span>
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-2.5 pt-0">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Folder className="w-3 h-3" />
                <span className="truncate">
                  {thread.folderName ?? "Untitled"}
                </span>
              </div>
              <span className="opacity-70">
                {formatDistanceToNow(new Date(thread.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
