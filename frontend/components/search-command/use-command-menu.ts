import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useFileSelection } from "@/hooks/use-file-selection";
import { Folder as FolderType } from "@/types";
import { useSidebarState } from "@/hooks/use-sidebar-state";

interface UseCommandMenuProps {
  folders?: FolderType[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onFolderSelect?: (folderId: string) => void;
  onNewFolder?: () => void;
  onNewChatDialog?: () => void;
}

export function useCommandMenu({
  folders,
  open,
  setOpen,
  onFolderSelect,
  onNewFolder,
  onNewChatDialog,
}: UseCommandMenuProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { openFileView } = useFileSelection();
  const [inputValue, setInputValue] = useState("");
  const { setExpandedFolder } = useSidebarState();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      setInputValue("");
      command();
    },
    [setOpen]
  );

  const recentThreads = useMemo(() => {
    if (!folders) return [];
    return folders
      .flatMap((f) => f.threads || [])
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  }, [folders]);

  const handleOpenThread = useCallback(
    (folderId: string, threadId: string) => {
      router.push(`/chat?threadId=${threadId}&folderId=${folderId}`);
      setExpandedFolder(folderId);
      console.log("Opening thread:", threadId, "in folder:", folderId);
    },
    [router, setExpandedFolder]
  );

  const handlers = useMemo(
    () => ({
      newChat: () => onNewChatDialog?.(),
      newChatDialog: () => onNewChatDialog?.(),
      newFolder: () => onNewFolder?.(),
      selectFolder: (folderId: string) => onFolderSelect?.(folderId),
      openThread: handleOpenThread,
      openFile: (fileId: string) => openFileView(fileId),
      setTheme: (theme: string) => setTheme(theme),
    }),
    [
      handleOpenThread,
      onNewFolder,
      onNewChatDialog,
      onFolderSelect,
      openFileView,
      setTheme,
    ]
  );

  return {
    inputValue,
    setInputValue,
    runCommand,
    recentThreads,
    handlers,
  };
}
