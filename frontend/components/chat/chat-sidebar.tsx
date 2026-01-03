"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useFolders, useThread } from "@/hooks/use-chat";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { UserMenu, SidebarHeaderSection, FoldersSection } from "./sidebar";
import { SearchCommand } from "@/components/search-command";
import { NewChatDialog } from "@/components/new-chat-dialog";

export function ChatSidebar() {
  const { data: folders, isLoading } = useFolders();
  const searchParams = useSearchParams();
  const threadId = searchParams.get("threadId");
  const folderId = searchParams.get("folderId");
  const { data: thread } = useThread(threadId || "");

  const {
    expandedFolder,
    isNewFolderDialogOpen,
    isNewChatDialogOpen,
    isSearchOpen,
    setExpandedFolder,
    toggleFolder,
    setIsNewFolderDialogOpen,
    setIsNewChatDialogOpen,
    setIsSearchOpen,
  } = useSidebarState();

  const router = useRouter();

  //take threadId from url and set expanded folder to thread's folderId
  useEffect(() => {
    if (!threadId) {
      return;
    }
    const folderId = folders?.find((folder) =>
      folder.threads?.some((t) => t.id === threadId)
    )?.id;

    if (threadId && folderId) {
      setExpandedFolder(folderId);
    } else {
      setExpandedFolder(null);
      console.log("No threadId or folderId found in URL");
    }

  }, [threadId, thread?.folderId, setExpandedFolder, folders]);

  useEffect(() => {
    if (threadId && thread?.folderId) {
      setExpandedFolder(thread.folderId);
    } else if (folderId) {
      setExpandedFolder(folderId);
    }
  }, [threadId, thread?.folderId, folderId, setExpandedFolder]);

  const handleToggleFolder = (folderId: string) => {
    toggleFolder(folderId);
    if (expandedFolder !== folderId) {
      router.push(`/chat?folderId=${folderId}`);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setExpandedFolder(folderId);
    router.push(`/chat?folderId=${folderId}`);
  };

  return (
    <Sidebar collapsible="icon">
      <SearchCommand
        folders={folders}
        open={isSearchOpen}
        setOpen={setIsSearchOpen}
        onFolderSelect={handleFolderSelect}
        onNewFolder={() => setIsNewFolderDialogOpen(true)}
        onNewChatDialog={() => setIsNewChatDialogOpen(true)}
      />
      <SidebarHeaderSection onSearchClick={() => setIsSearchOpen(true)} />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsNewChatDialogOpen(true)}
                className="justify-center font-medium border border-sidebar-border shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
              >
                <Plus className="mr-1 size-4" />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <FoldersSection
          folders={folders}
          isLoading={isLoading}
          expandedFolder={expandedFolder}
          onToggleFolder={handleToggleFolder}
          isNewFolderDialogOpen={isNewFolderDialogOpen}
          onNewFolderDialogChange={setIsNewFolderDialogOpen}
        />
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />

      <NewChatDialog
        open={isNewChatDialogOpen}
        onOpenChange={setIsNewChatDialogOpen}
        folders={folders}
      />
    </Sidebar>
  );
}
