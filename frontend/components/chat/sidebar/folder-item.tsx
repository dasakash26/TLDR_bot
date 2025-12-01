"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  FolderGit2,
  MessageSquare,
  ChevronRight,
  FileText,
  MoreHorizontal,
  Trash2,
  Pencil,
  Upload,
  Plus,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useFolderFiles,
  useFolderThreads,
  useCreateThread,
  useDeleteFolder,
  useUpdateThread,
  useDeleteThread,
  useUploadFile,
  useUpdateFolder,
  useDeleteFile,
} from "@/hooks/use-chat";
import { Folder, Thread, File as FileType } from "@/types";
import { useRouter } from "next/navigation";
import { FileMetadataDialog } from "../file-metadata-dialog";

interface FolderItemProps {
  folder: Folder;
  isExpanded: boolean;
  onToggle: () => void;
}

export function FolderItem({ folder, isExpanded, onToggle }: FolderItemProps) {
  const { data: files, isLoading: isLoadingFiles } = useFolderFiles(
    folder.folder_id
  );
  const { data: threads, isLoading: isLoadingThreads } = useFolderThreads(
    folder.folder_id
  );
  const { mutate: createThread, isPending: isCreatingThread } =
    useCreateThread();
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: updateFolder } = useUpdateFolder();
  const { mutate: deleteThread } = useDeleteThread();
  const { mutate: updateThread } = useUpdateThread();
  const { mutate: uploadFile, isPending: isUploadingFile } = useUploadFile();
  const { mutate: deleteFile } = useDeleteFile();

  const [isFilesOpen, setIsFilesOpen] = useState(true);
  const [isChatsOpen, setIsChatsOpen] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isFileMetadataOpen, setIsFileMetadataOpen] = useState(false);

  // Dialog States
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);

  const [threadToRename, setThreadToRename] = useState<Thread | null>(null);
  const [newThreadName, setNewThreadName] = useState("");
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateThread = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    createThread(
      { folder_id: folder.folder_id, thread_name: "New Chat" },
      {
        onSuccess: (data) => {
          router.push(`/chat?threadId=${data.thread_id}`);
        },
      }
    );
  };

  const handleDeleteFolder = () => {
    deleteFolder(folder.folder_id);
    setDeleteFolderOpen(false);
  };

  const handleRenameFolder = () => {
    if (newFolderName && newFolderName !== folder.name) {
      updateFolder({ folderId: folder.folder_id, newName: newFolderName });
    }
    setRenameFolderOpen(false);
  };

  const handleRenameThread = () => {
    if (
      threadToRename &&
      newThreadName &&
      newThreadName !== threadToRename.name
    ) {
      updateThread({
        thread_id: threadToRename.id,
        new_name: newThreadName,
      });
    }
    setThreadToRename(null);
  };

  const handleDeleteThread = () => {
    if (threadToDelete) {
      deleteThread(threadToDelete.id);
    }
    setThreadToDelete(null);
  };

  const handleDeleteFile = () => {
    if (fileToDelete) {
      deleteFile(fileToDelete.file_id);
    }
    setFileToDelete(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadFile({ folderId: folder.folder_id, file });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileClick = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFileId(fileId);
    setIsFileMetadataOpen(true);
  };

  return (
    <>
      <SidebarMenuItem>
        <div className="flex items-center w-full group/folder">
          <SidebarMenuButton
            onClick={onToggle}
            isActive={isExpanded}
            className="font-medium flex-1"
          >
            <ChevronRight
              className={`mr-2 size-4 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
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
              <DropdownMenuItem onClick={() => handleCreateThread()}>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => triggerFileUpload()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setNewFolderName(folder.name);
                  setRenameFolderOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Rename Folder
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteFolderOpen(true);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <SidebarMenuSub className="pr-0 mr-0 border-l-sidebar-border/50 ml-6">
                {/* Files Section */}
                <div className="mt-2">
                  <div className="flex items-center justify-between w-full px-2 py-1 group/section">
                    <button
                      onClick={() => setIsFilesOpen(!isFilesOpen)}
                      className="flex items-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider hover:text-muted-foreground transition-colors"
                    >
                      <ChevronDown
                        className={`mr-1 size-3 transition-transform ${
                          isFilesOpen ? "" : "-rotate-90"
                        }`}
                      />
                      Files ({files?.length || 0})
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover/section:opacity-100 transition-opacity"
                      onClick={triggerFileUpload}
                      disabled={isUploadingFile}
                    >
                      {isUploadingFile ? (
                        <Skeleton className="w-4 h-4 rounded-full" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {isFilesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {isLoadingFiles && (
                          <div className="px-2 py-1">
                            <Skeleton className="h-3 w-2/3 rounded" />
                          </div>
                        )}
                        {files?.map((file) => (
                          <SidebarMenuSubItem key={file.file_id}>
                            <div className="flex items-center w-full group/file">
                              <SidebarMenuSubButton
                                asChild
                                className="flex-1 h-8 text-xs"
                              >
                                <a
                                  href="#"
                                  onClick={(e) =>
                                    handleFileClick(e, file.file_id)
                                  }
                                  className="group flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                                >
                                  <FileText className="size-3.5 opacity-70 group-hover:text-primary transition-colors shrink-0" />
                                  <span className="truncate">
                                    {file.file_name}
                                  </span>
                                </a>
                              </SidebarMenuSubButton>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 opacity-0 group-hover/file:opacity-100 transition-opacity mr-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFileToDelete(file);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </SidebarMenuSubItem>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Threads Section */}
                <div className="mt-2">
                  <div className="flex items-center justify-between w-full px-2 py-1 group/section">
                    <button
                      onClick={() => setIsChatsOpen(!isChatsOpen)}
                      className="flex items-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider hover:text-muted-foreground transition-colors"
                    >
                      <ChevronDown
                        className={`mr-1 size-3 transition-transform ${
                          isChatsOpen ? "" : "-rotate-90"
                        }`}
                      />
                      Chats ({threads?.length || 0})
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover/section:opacity-100 transition-opacity"
                      onClick={handleCreateThread}
                      disabled={isCreatingThread}
                    >
                      {isCreatingThread ? (
                        <Skeleton className="w-4 h-4 rounded-full" />
                      ) : (
                        <Plus className="size-4" />
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {isChatsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {isLoadingThreads && (
                          <div className="px-2 py-1 space-y-2">
                            <Skeleton className="h-3 w-3/4 rounded" />
                            <Skeleton className="h-3 w-1/2 rounded" />
                          </div>
                        )}
                        {threads?.map((thread) => (
                          <SidebarMenuSubItem key={thread.id}>
                            <div className="flex items-center w-full group/thread">
                              <SidebarMenuSubButton
                                asChild
                                className="flex-1 h-8 text-xs text-sidebar-foreground/80 hover:text-sidebar-foreground"
                              >
                                <Link
                                  href={`/chat?threadId=${thread.id}`}
                                  className="group flex items-center gap-2"
                                >
                                  <MessageSquare className="size-3.5 opacity-70 group-hover:text-primary transition-colors shrink-0" />
                                  <span className="truncate">
                                    {thread.name}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 opacity-0 group-hover/thread:opacity-100 transition-opacity mr-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewThreadName(thread.name);
                                      setThreadToRename(thread);
                                    }}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setThreadToDelete(thread);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </SidebarMenuSubItem>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SidebarMenuSub>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarMenuItem>

      {/* Dialogs */}
      <FileMetadataDialog
        fileId={selectedFileId}
        open={isFileMetadataOpen}
        onOpenChange={setIsFileMetadataOpen}
      />

      {/* Rename Folder Dialog */}
      <Dialog open={renameFolderOpen} onOpenChange={setRenameFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameFolder()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameFolderOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameFolder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Alert */}
      <AlertDialog open={deleteFolderOpen} onOpenChange={setDeleteFolderOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the folder "{folder.name}" and all
              its contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Thread Dialog */}
      <Dialog
        open={!!threadToRename}
        onOpenChange={(open) => !open && setThreadToRename(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="thread-name" className="mb-2 block">
              Name
            </Label>
            <Input
              id="thread-name"
              value={newThreadName}
              onChange={(e) => setNewThreadName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameThread()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setThreadToRename(null)}>
              Cancel
            </Button>
            <Button onClick={handleRenameThread}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Thread Alert */}
      <AlertDialog
        open={!!threadToDelete}
        onOpenChange={(open) => !open && setThreadToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the chat "{threadToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteThread}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete File Alert */}
      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={(open) => !open && setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the file "{fileToDelete?.file_name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
