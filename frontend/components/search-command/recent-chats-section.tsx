import { MessageSquare } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Thread, Folder } from "@/types";

interface RecentChatsSectionProps {
  recentThreads: Thread[];
  folders?: Folder[];
  inputValue: string;
  onSelect: (threadId: string) => void;
}

export function RecentChatsSection({
  recentThreads,
  folders,
  inputValue,
  onSelect,
}: RecentChatsSectionProps) {
  if (inputValue || recentThreads.length === 0) return null;

  return (
    <>
      <CommandGroup heading="Recent Chats">
        {recentThreads.map((thread) => (
          <CommandItem key={thread.id} onSelect={() => onSelect(thread.id)}>
            <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{thread.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {
                folders?.find((f) => f.threads?.some((t) => t.id === thread.id))
                  ?.name
              }
            </span>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}
