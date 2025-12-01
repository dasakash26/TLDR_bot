"use client";

// Empty state component for the chat area
import {
  Sparkles,
  MessageSquare,
  Folder,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useRecentThreads, useFolders } from "@/hooks/use-chat";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Sparkles as SparklesEffect } from "@/components/ui/sparkles";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function EmptyState() {
  const { data: recentThreads, isLoading: isLoadingThreads } =
    useRecentThreads();
  const { data: folders, isLoading: isLoadingFolders } = useFolders();

  if (isLoadingThreads || isLoadingFolders) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <header className="flex-none h-14 px-4 flex items-center border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-col items-center justify-center flex-1 p-8 gap-8">
          <div className="w-full max-w-4xl space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <header className="flex-none h-14 px-4 flex items-center border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-col flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
        <div className="w-full max-w-5xl mx-auto space-y-10">
          {/* Welcome Section */}
          <div className="relative flex flex-col gap-2 p-6 overflow-hidden rounded-2xl bg-primary/5 border border-primary/10">
            <SparklesEffect
              color="hsl(var(--primary))"
              count={30}
              minSize={2}
              maxSize={4}
              speed={0.5}
              className="opacity-50"
            />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                Welcome back{" "}
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </h1>
              <p className="text-muted-foreground">
                Pick up where you left off or explore your knowledge base.
              </p>
            </div>
          </div>

          {/* Recent Threads */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              Recent Activity
            </div>

            {recentThreads && recentThreads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentThreads.map((thread) => (
                  <Link key={thread.id} href={`/chat?threadId=${thread.id}`}>
                    <Card className="h-full hover:bg-muted/50 transition-colors border-border/50 shadow-sm hover:shadow-md group">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-start justify-between gap-2">
                          <span className="truncate leading-tight">
                            {thread.name}
                          </span>
                          <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Folder className="w-3 h-3" />
                            <span className="truncate">
                              {thread.folder_name}
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
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                No recent activity found.
              </div>
            )}
          </div>

          {/* All Folders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Folder className="w-4 h-4" />
              Your Folders
            </div>

            {folders && folders.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <div
                    key={folder.folder_id}
                    className="flex flex-col p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Folder className="w-4 h-4" />
                      </div>
                      <span className="font-medium truncate">
                        {folder.name}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                      <span>{folder.files?.length || 0} files</span>
                      <span>{folder.threads?.length || 0} chats</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                No folders created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
