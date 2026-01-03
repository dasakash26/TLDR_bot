"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
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
import { FolderHeader } from "./folder-header";
import { FilesSection } from "./files-section";
import { ThreadsSection } from "./threads-section";
import { RenameDialog, DeleteAlert } from "./generic-dialogs";
import { useFileSelection } from "@/hooks/use-file-selection";
import { ShareDialog } from "@/components/share";

interface FolderItemProps {
  folder: Folder;
  isExpanded: boolean;
  onToggle: () => void;
}

export function FolderItem({ folder, isExpanded, onToggle }: FolderItemProps) {
  const { data: files, isLoading: isLoadingFiles } = useFolderFiles(folder.id);
  const { data: threads, isLoading: isLoadingThreads } = useFolderThreads(
    folder.id
  );
  const { mutate: createThread, isPending: isCreatingThread } =
    useCreateThread();
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: updateFolder } = useUpdateFolder();
  const { mutate: deleteThread } = useDeleteThread();
  const { mutate: updateThread } = useUpdateThread();
  const { mutate: uploadFile, isPending: isUploadingFile } = useUploadFile();
  const { mutate: deleteFile } = useDeleteFile();
  const { openFileView } = useFileSelection();

  // Dialog States
  const [renameFolderOpen, setRenameFolderOpen] = useState(false);
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
  const [shareFolderOpen, setShareFolderOpen] = useState(false);
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
      { folder_id: folder.id, thread_name: "New Chat" },
      {
        onSuccess: (data) => {
          router.push(`/chat?threadId=${data.id}`);
        },
      }
    );
  };

  const handleDeleteFolder = () => {
    deleteFolder(folder.id);
    setDeleteFolderOpen(false);
  };

  const handleRenameFolder = () => {
    if (newFolderName && newFolderName !== folder.name) {
      updateFolder({ folderId: folder.id, newName: newFolderName });
    }
    setRenameFolderOpen(false);
  };

  const handleShareFolder = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShareFolderOpen(true);
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
      deleteFile(fileToDelete.id);
    }
    setFileToDelete(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadFile({ folderId: folder.id, file });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileUpload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileClick = (fileId: string) => {
    openFileView(fileId);
  };

  const handleRenameThreadOpen = (thread: Thread) => {
    setNewThreadName(thread.name);
    setThreadToRename(thread);
  };

  return (
    <>
      <SidebarMenuItem>
        <FolderHeader
          folder={folder}
          isExpanded={isExpanded}
          onToggle={onToggle}
          onCreateThread={handleCreateThread}
          onUploadFile={triggerFileUpload}
          onRenameFolder={() => {
            setNewFolderName(folder.name);
            setRenameFolderOpen(true);
          }}
          onDeleteFolder={() => setDeleteFolderOpen(true)}
          onShareFolder={handleShareFolder}
          fileInputRef={fileInputRef}
          onFileChange={handleFileUpload}
        />

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
                <FilesSection
                  files={files}
                  isLoading={isLoadingFiles}
                  isUploading={isUploadingFile}
                  onUploadFile={triggerFileUpload}
                  onFileClick={handleFileClick}
                  onDeleteFile={setFileToDelete}
                />

                <ThreadsSection
                  threads={threads}
                  isLoading={isLoadingThreads}
                  isCreating={isCreatingThread}
                  onCreateThread={handleCreateThread}
                  onRenameThread={handleRenameThreadOpen}
                  onDeleteThread={setThreadToDelete}
                />
              </SidebarMenuSub>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarMenuItem>

      {/* Dialogs */}
      <RenameDialog
        open={renameFolderOpen}
        title="Rename Folder"
        inputLabel="Name"
        inputId="folder-name"
        value={newFolderName}
        onValueChange={setNewFolderName}
        onOpenChange={setRenameFolderOpen}
        onSave={handleRenameFolder}
      />

      <DeleteAlert
        open={deleteFolderOpen}
        title="Are you sure?"
        description={`This will permanently delete the folder "${folder.name}" and all its contents.`}
        onOpenChange={setDeleteFolderOpen}
        onDelete={handleDeleteFolder}
      />

      <RenameDialog
        open={!!threadToRename}
        title="Rename Chat"
        inputLabel="Name"
        inputId="thread-name"
        value={newThreadName}
        onValueChange={setNewThreadName}
        onOpenChange={(open) => !open && setThreadToRename(null)}
        onSave={handleRenameThread}
      />

      <DeleteAlert
        open={!!threadToDelete}
        title="Delete Chat?"
        description={`This will permanently delete the chat "${threadToDelete?.name}".`}
        onOpenChange={(open) => !open && setThreadToDelete(null)}
        onDelete={handleDeleteThread}
      />

      <DeleteAlert
        open={!!fileToDelete}
        title="Delete File?"
        description={`This will permanently delete the file "${fileToDelete?.filename}".`}
        onOpenChange={(open) => !open && setFileToDelete(null)}
        onDelete={handleDeleteFile}
      />

      <ShareDialog
        open={shareFolderOpen}
        onOpenChange={setShareFolderOpen}
        folderId={folder.id}
        folderName={folder.name}
      />
    </>
  );
}
