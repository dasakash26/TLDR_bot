"use client";

import { FolderGit2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface FolderHeaderProps {
  folderName: string;
}

export function FolderHeader({ folderName }: FolderHeaderProps) {
  return (
    <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border mx-1" />
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <FolderGit2 className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground leading-none tracking-tight">
            {folderName}
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">
            Folder Overview
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <ModeToggle />
      </div>
    </header>
  );
}
