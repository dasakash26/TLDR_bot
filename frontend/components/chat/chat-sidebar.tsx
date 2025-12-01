"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Plus, Search, Loader2 } from "lucide-react";
import { SidebarSkeleton } from "@/components/chat/sidebar-skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFolders, useCreateFolder } from "@/hooks/use-chat";
import { FolderItem } from "@/components/chat/sidebar/folder-item";
import { UserMenu } from "@/components/chat/sidebar/user-menu";
import { SearchCommand } from "@/components/search-command";

export function ChatSidebar() {
  const { data: folders, isLoading } = useFolders();
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { mutate: createFolder, isPending: isCreatingFolder } =
    useCreateFolder();

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolder(newFolderName, {
      onSuccess: () => {
        setIsNewFolderDialogOpen(false);
        setNewFolderName("");
      },
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SearchCommand
        folders={folders}
        open={isSearchOpen}
        setOpen={setIsSearchOpen}
      />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">RECAP</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="mr-2 size-4" />
              <span>Search</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="justify-center font-medium border border-sidebar-border shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
              >
                <Link href="/chat">
                  <Plus className="mr-1 size-4" />
                  <span>New Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <Dialog
            open={isNewFolderDialogOpen}
            onOpenChange={setIsNewFolderDialogOpen}
          >
            <DialogTrigger asChild>
              <SidebarGroupAction title="New Folder">
                <Plus /> <span className="sr-only">New Folder</span>
              </SidebarGroupAction>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Organize your chats and files into folders.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="col-span-3"
                    placeholder="Project Alpha"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateFolder}
                  disabled={isCreatingFolder}
                >
                  {isCreatingFolder && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Folder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <SidebarSkeleton />
              ) : (
                folders?.map((folder) => (
                  <FolderItem
                    key={folder.folder_id}
                    folder={folder}
                    isExpanded={expandedFolders.includes(folder.folder_id)}
                    onToggle={() => toggleFolder(folder.folder_id)}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
