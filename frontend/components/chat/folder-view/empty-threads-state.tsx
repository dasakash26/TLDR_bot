"use client";

interface EmptyThreadsStateProps {
  message?: string;
}

export function EmptyThreadsState({
  message = "No threads yet. Create one to start chatting.",
}: EmptyThreadsStateProps) {
  return (
    <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
      {message}
    </div>
  );
}
