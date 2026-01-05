"use client";

import {
  FolderGit2,
  MessageSquare,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Pencil,
  Upload,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Folder } from "@/types";

interface FolderHeaderProps {
  folder: Folder;
  isExpanded: boolean;
  onToggle: () => void;
  onCreateThread: () => void;
  onRenameFolder: () => void;
  onDeleteFolder: () => void;
  onShareFolder?: () => void;
  setFileUploadOpen?: (
  ) => void;
}

export function FolderHeader({
  folder,
  isExpanded,
  onToggle,
  onCreateThread,
  onRenameFolder,
  onDeleteFolder,
  onShareFolder,
  setFileUploadOpen,
}: FolderHeaderProps) {
  return (
    <div className="flex items-center w-full group/folder">
      <SidebarMenuButton
        onClick={onToggle}
        isActive={isExpanded}
        className="font-medium flex-1"
      >
        <ChevronRight
          className={`mr-2 size-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
            }`}
        />
        <FolderGit2
          className={
            isExpanded ? "text-sidebar-primary" : "text-muted-foreground"
          }
        />
        <span className="truncate">{folder.name}</span>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover/folder:opacity-100 transition-opacity mr-1"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onCreateThread}>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Chat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFileUploadOpen && setFileUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {onShareFolder && (
            <DropdownMenuItem onClick={onShareFolder}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Folder
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onRenameFolder}>
            <Pencil className="mr-2 h-4 w-4" />
            Rename Folder
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDeleteFolder}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
