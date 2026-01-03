"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Folder as FolderType } from "@/types";
import { useCommandMenu } from "./search-command/use-command-menu";
import { RecentChatsSection } from "./search-command/recent-chats-section";
import { ActionsSection } from "./search-command/actions-section";
import { FoldersSection } from "./search-command/folders-section";
import { ThreadsSection } from "./search-command/threads-section";
import { FilesSection } from "./search-command/files-section";
import { ThemeSection } from "./search-command/theme-section";
import { SettingsSection } from "./search-command/settings-section";

interface SearchCommandProps {
  folders?: FolderType[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onFolderSelect?: (folderId: string) => void;
  onNewFolder?: () => void;
  onNewChatDialog?: () => void;
}

export function SearchCommand(props: SearchCommandProps) {
  const { folders, open, setOpen } = props;
  const { inputValue, setInputValue, runCommand, recentThreads, handlers } =
    useCommandMenu(props);

  const hasContent = folders && folders.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={inputValue}
        onValueChange={setInputValue}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <RecentChatsSection
          recentThreads={recentThreads}
          folders={folders}
          inputValue={inputValue}
          onSelect={(threadId: string) =>
            runCommand(() => {
              const folder = folders?.find((f) =>
                f.threads?.some((t) => t.id === threadId)
              );
              if (folder) handlers.openThread(folder.id, threadId);
            })
          }
        />

        <ActionsSection
          onNewChat={() => runCommand(handlers.newChat)}
          onNewFolder={() => runCommand(handlers.newFolder)}
        />

        {hasContent && (
          <>
            <CommandSeparator />
            <FoldersSection
              folders={folders}
              onSelect={(id: string) =>
                runCommand(() => handlers.selectFolder(id))
              }
            />

            <CommandSeparator />
            <ThreadsSection
              folders={folders}
              onSelect={(threadId: string) =>
                runCommand(() => {
                  const folder = folders?.find((f) =>
                    f.threads?.some((t) => t.id === threadId)
                  );
                  console.log("Selected thread:", threadId, "in folder:", folder);
                  if (folder) handlers.openThread(folder.id, threadId);
                })
              }
            />

            <CommandSeparator />
            <FilesSection
              folders={folders}
              onSelect={(id: string) => runCommand(() => handlers.openFile(id))}
            />
          </>
        )}

        <CommandSeparator />
        <ThemeSection
          onSelectTheme={(theme: string) =>
            runCommand(() => handlers.setTheme(theme))
          }
        />

        <SettingsSection />
      </CommandList>
    </CommandDialog>
  );
}
