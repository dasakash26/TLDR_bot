import { Folder as FolderIcon, MessageSquare, FileText } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Folder } from "@/types";

interface FoldersSectionProps {
  folders: Folder[];
  onSelect: (folderId: string) => void;
}

export function FoldersSection({ folders, onSelect }: FoldersSectionProps) {
  return (
    <CommandGroup heading="Folders">
      {folders.map((folder) => (
        <CommandItem key={folder.id} onSelect={() => onSelect(folder.id)}>
          <FolderIcon className="mr-2 h-4 w-4" />
          <span>{folder.name}</span>
          <span className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {folder.threads?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {folder.files?.length || 0}
            </span>
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
