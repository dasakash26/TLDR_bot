import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Header Skeleton */}
      <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </header>

      {/* Messages Skeleton */}
      <div className="flex-1 p-4 space-y-8 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            {/* User Message Skeleton */}
            <div className="flex justify-end gap-4 w-full">
              <div className="flex flex-col items-end gap-2 max-w-[75%]">
                <Skeleton className="h-12 w-64 rounded-[20px] rounded-tr-sm" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* AI Message Skeleton */}
            <div className="flex justify-start gap-4 w-full">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col items-start gap-2 max-w-[75%]">
                <Skeleton className="h-24 w-96 rounded-[20px] rounded-tl-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className="p-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-14 w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
