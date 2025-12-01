"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Folder,
  FileText,
  MessageSquare,
  Plus,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Folder as FolderType } from "@/types";

interface SearchCommandProps {
  folders?: FolderType[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SearchCommand({ folders, open, setOpen }: SearchCommandProps) {
  const { setTheme } = useTheme();
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/chat"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Chat</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Folder className="mr-2 h-4 w-4" />
            <span>New Folder</span>
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {folders && folders.length > 0 && (
          <>
            <CommandGroup heading="Folders">
              {folders.map((folder) => (
                <CommandItem
                  key={folder.folder_id}
                  onSelect={() =>
                    runCommand(() => {
                      // Logic to expand folder or navigate to it
                      console.log("Selected folder", folder.name);
                    })
                  }
                >
                  <Folder className="mr-2 h-4 w-4" />
                  <span>{folder.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Threads">
              {folders
                .flatMap((f) => f.threads || [])
                .map((thread) => (
                  <CommandItem
                    key={thread.id}
                    onSelect={() =>
                      runCommand(() =>
                        router.push(`/chat?threadId=${thread.id}`)
                      )
                    }
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>{thread.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {
                        folders.find((f) =>
                          f.threads?.some((t) => t.id === thread.id)
                        )?.name
                      }
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Files">
              {folders
                .flatMap((f) => f.files || [])
                .map((file) => (
                  <CommandItem
                    key={file.file_id}
                    onSelect={() =>
                      runCommand(() => {
                        // Maybe show file preview or just log for now
                        console.log("Selected file", file.file_name);
                      })
                    }
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>{file.file_name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {
                        folders.find((f) =>
                          f.files?.some((fi) => fi.file_id === file.file_id)
                        )?.name
                      }
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => {})}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
