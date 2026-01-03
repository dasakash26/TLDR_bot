import { FileText } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Folder } from "@/types";

interface FilesSectionProps {
  folders: Folder[];
  onSelect: (fileId: string) => void;
}

export function FilesSection({ folders, onSelect }: FilesSectionProps) {
  const allFiles = folders.flatMap((f) => f.files || []);

  return (
    <CommandGroup heading="Files">
      {allFiles.map((file) => (
        <CommandItem key={file.id} onSelect={() => onSelect(file.id)}>
          <FileText className="mr-2 h-4 w-4" />
          <span>{file.filename}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {
              folders.find((f) => f.files?.some((fi) => fi.id === file.id))
                ?.name
            }
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
