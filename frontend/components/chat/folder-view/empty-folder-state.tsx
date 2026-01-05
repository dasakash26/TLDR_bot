"use client";

import { FolderGit2 } from "lucide-react";

export function EmptyFolderState() {
  return (
    <div className="flex flex-col h-full w-full bg-background items-center justify-center">
      <FolderGit2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground text-lg">
        Select a folder to view details
      </p>
    </div>
  );
}
