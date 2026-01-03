"use client";

import { create } from "zustand";

interface SidebarState {
  expandedFolder: string | null;
  isNewFolderDialogOpen: boolean;
  isNewChatDialogOpen: boolean;
  isSearchOpen: boolean;
  setExpandedFolder: (folderId: string | null) => void;
  toggleFolder: (folderId: string) => void;
  setIsNewFolderDialogOpen: (open: boolean) => void;
  setIsNewChatDialogOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
}

export const useSidebarState = create<SidebarState>((set, get) => ({
  expandedFolder: null,
  isNewFolderDialogOpen: false,
  isNewChatDialogOpen: false,
  isSearchOpen: false,
  setExpandedFolder: (folderId: string | null) =>
    set({ expandedFolder: folderId }),
  toggleFolder: (folderId: string) => {
    const { expandedFolder } = get();
    set({ expandedFolder: expandedFolder === folderId ? null : folderId });
  },
  setIsNewFolderDialogOpen: (open: boolean) =>
    set({ isNewFolderDialogOpen: open }),
  setIsNewChatDialogOpen: (open: boolean) => set({ isNewChatDialogOpen: open }),
  setIsSearchOpen: (open: boolean) => set({ isSearchOpen: open }),
}));
