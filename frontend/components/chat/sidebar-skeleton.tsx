import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 px-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-2 p-2">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 flex-1 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
