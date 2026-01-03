import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function EmptyStateLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <header className="flex-none h-14 px-4 flex items-center border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-col flex-1 overflow-y-auto p-4 md:p-5">
        <div className="w-full max-w-2xl mx-auto space-y-4.5">
          {/* Skeleton: Welcome */}
          <div className="relative flex flex-col gap-2 p-4 overflow-hidden rounded-2xl border border-border/50 bg-background/70">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-9 w-32 rounded-full" />
              <Skeleton className="h-9 w-40 rounded-full" />
            </div>
          </div>

          {/* Skeleton: Recent threads */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/40 bg-muted/40 p-3 space-y-2"
                >
                  <Skeleton className="h-4 w-48" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton: Suggestions */}
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-36" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/40 bg-muted/30 p-3 space-y-2"
                >
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-44" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
              <div className="sm:col-span-2 rounded-xl border border-border/40 bg-muted/30 p-3 space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((chip) => (
                    <Skeleton key={chip} className="h-6 w-28 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
