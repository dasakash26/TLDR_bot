"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Plus,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Thread } from "@/types";

interface ThreadsSectionProps {
  folderId?: string;
  threads?: Thread[];
  isLoading: boolean;
  isCreating: boolean;
  onCreateThread: () => void;
  onRenameThread: (thread: Thread) => void;
  onDeleteThread: (thread: Thread) => void;
}

export function ThreadsSection({
  folderId,
  threads,
  isLoading,
  isCreating,
  onCreateThread,
  onRenameThread,
  onDeleteThread,
}: ThreadsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const searchParams = useSearchParams();
  const activeThreadId = searchParams.get("threadId");

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between w-full px-2 py-1 group/section">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider hover:text-muted-foreground transition-colors"
        >
          <ChevronDown
            className={`mr-1 size-3 transition-transform ${isOpen ? "" : "-rotate-90"
              }`}
          />
          Chats ({threads?.length || 0})
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 opacity-0 group-hover/section:opacity-100 transition-opacity"
          onClick={onCreateThread}
          disabled={isCreating}
        >
          {isCreating ? (
            <Skeleton className="w-4 h-4 rounded-full" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {isLoading && (
              <div className="px-2 py-1 space-y-2">
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            )}
            {threads?.map((thread) => {
              const isActive = activeThreadId === thread.id;
              return (
                <SidebarMenuSubItem key={thread.id}>
                  <div className="flex items-center w-full group/thread">
                    <SidebarMenuSubButton
                      asChild
                      className={`flex-1 h-8 text-xs transition-colors ${isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                        }`}
                    >
                      <Link
                        href={`/chat?threadId=${thread.id}&folderId=${folderId}`}
                        className="group flex items-center gap-2"
                      >
                        <MessageSquare
                          className={`size-3.5 shrink-0 transition-colors ${isActive
                            ? "text-primary opacity-100"
                            : "opacity-70 group-hover:text-primary"
                            }`}
                        />
                        <span className="truncate">{thread.name}</span>
                      </Link>
                    </SidebarMenuSubButton>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover/thread:opacity-100 transition-opacity mr-1 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onRenameThread(thread);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteThread(thread);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuSubItem>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
