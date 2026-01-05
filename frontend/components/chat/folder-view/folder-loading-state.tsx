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
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border/40 bg-muted/40 p-4 space-y-2"
              >
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
