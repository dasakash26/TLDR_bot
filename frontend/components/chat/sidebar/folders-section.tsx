"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarSkeleton } from "@/components/chat";
import { FolderItem, NewFolderDialog } from ".";
import type { Folder } from "@/types";

interface FoldersSectionProps {
  folders?: Folder[];
  isLoading: boolean;
  expandedFolder: string | null;
  onToggleFolder: (folderId: string) => void;
  isNewFolderDialogOpen: boolean;
  onNewFolderDialogChange: (open: boolean) => void;
}

export function FoldersSection({
  folders,
  isLoading,
  expandedFolder,
  onToggleFolder,
  isNewFolderDialogOpen,
  onNewFolderDialogChange,
}: FoldersSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <NewFolderDialog
        open={isNewFolderDialogOpen}
        onOpenChange={onNewFolderDialogChange}
      />
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            <SidebarSkeleton />
          ) : (
            folders?.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                isExpanded={expandedFolder === folder.id}
                onToggle={() => onToggleFolder(folder.id)}
              />
            
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
