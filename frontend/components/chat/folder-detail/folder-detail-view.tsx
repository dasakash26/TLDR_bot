"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFolderFiles, useFolderThreads, useFolder } from "@/hooks/use-chat";
import { useFolderCollaborators } from "@/hooks/use-folder-sharing";
import { useFileSelection } from "@/hooks/use-file-selection";
import { useUser } from "@/hooks/use-user";
import { FileMetadataDialog } from "..";
import { ShareDialog } from "@/components/share";
import {
  FolderHeader,
  FolderStats,
  CollaboratorsSection,
  ThreadsSection,
  FilesSection,
  EmptyFolderState,
  FolderLoadingState,
} from ".";

export function FolderDetailView() {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");
  const router = useRouter();
  const { openFileView, selectedFileId, isFileViewOpen, closeFileView } =
    useFileSelection();
  const { user } = useUser();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: folder, isLoading: isFolderLoading } = useFolder(
    folderId || ""
  );
  const { data: files = [], isLoading: isLoadingFiles } = useFolderFiles(
    folderId || ""
  );
  const { data: threads = [], isLoading: isLoadingThreads } = useFolderThreads(
    folderId || ""
  );
  const { data: collaborators = [], isLoading: isLoadingCollaborators } =
    useFolderCollaborators(folderId || "");

  if (!folderId) {
    return <EmptyFolderState />;
  }

  if (isFolderLoading) {
    return <FolderLoadingState />;
  }

  const handleThreadClick = (threadId: string) => {
    router.push(`/chat?threadId=${threadId}`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <FolderHeader folderName={folder?.name || "Folder"} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <FolderStats
            threadsCount={threads.length}
            filesCount={files.length}
            collaboratorsCount={collaborators.length}
            createdAt={folder?.createdAt || new Date().toISOString()}
          />

          <CollaboratorsSection
            collaborators={collaborators}
            isLoading={isLoadingCollaborators}
            currentUserId={user?.id}
            onShareClick={() => setShareDialogOpen(true)}
          />

          <ThreadsSection
            threads={threads}
            isLoading={isLoadingThreads}
            onThreadClick={handleThreadClick}
          />

          <FilesSection
            files={files}
            isLoading={isLoadingFiles}
            onFileClick={openFileView}
          />
        </div>
      </div>

      <FileMetadataDialog
        fileId={selectedFileId}
        open={isFileViewOpen}
        onOpenChange={closeFileView}
      />

      {folder && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          folderId={folder.id}
          folderName={folder.name}
        />
      )}
    </div>
  );
}
