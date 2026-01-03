import { MessageSquare } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Folder } from "@/types";

interface ThreadsSectionProps {
  folders: Folder[];
  onSelect: (threadId: string) => void;
}

export function ThreadsSection({ folders, onSelect }: ThreadsSectionProps) {
  const allThreads = folders.flatMap((f) => f.threads || []);

  return (
    <CommandGroup heading="Threads">
      {allThreads.map((thread) => (
        <CommandItem key={thread.id} onSelect={() => onSelect(thread.id)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>{thread.name}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {
              folders.find((f) => f.threads?.some((t) => t.id === thread.id))
                ?.name
            }
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
