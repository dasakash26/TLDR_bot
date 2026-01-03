"use client";

import { create } from "zustand";

interface FileSelectionState {
  selectedFileId: string | null;
  isFileViewOpen: boolean;
  setSelectedFile: (fileId: string | null) => void;
  openFileView: (fileId: string) => void;
  closeFileView: () => void;
}

export const useFileSelection = create<FileSelectionState>((set) => ({
  selectedFileId: null,
  isFileViewOpen: false,
  setSelectedFile: (fileId: string | null) => set({ selectedFileId: fileId }),
  openFileView: (fileId: string) =>
    set({ selectedFileId: fileId, isFileViewOpen: true }),
  closeFileView: () => set({ isFileViewOpen: false, selectedFileId: null }),
}));
