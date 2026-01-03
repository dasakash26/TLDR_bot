import { Plus, Folder } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

interface ActionsSectionProps {
  onNewChat: () => void;
  onNewFolder: () => void;
}

export function ActionsSection({
  onNewChat,
  onNewFolder,
}: ActionsSectionProps) {
  return (
    <CommandGroup heading="Actions">
      <CommandItem onSelect={onNewChat}>
        <Plus className="mr-2 h-4 w-4" />
        <span>New Chat</span>
        <CommandShortcut>⌘⇧N</CommandShortcut>
      </CommandItem>
      <CommandItem onSelect={onNewFolder}>
        <Folder className="mr-2 h-4 w-4" />
        <span>New Folder</span>
        <CommandShortcut>⌘N</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  );
}
