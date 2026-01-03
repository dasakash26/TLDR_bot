"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function FolderLoadingState() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
      </header>
      <div className="flex-1 p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
