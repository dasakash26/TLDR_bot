"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useFolderFiles,
  useFolderThreads,
  useFolder,
  Thread,
} from "@/hooks/use-chat";
import { useFolderCollaborators } from "@/hooks/use-folder-sharing";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  FolderGit2,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Calendar,
  User,
  Users,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFileSelection } from "@/hooks/use-file-selection";
import { FileMetadataDialog } from ".";
import { formatDistanceToNow } from "date-fns";
import { ShareDialog } from "@/components/share";
import { useUser } from "@/hooks/use-user";

export function FolderDetailView() {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");
  const router = useRouter();
  const { openFileView, selectedFileId, isFileViewOpen, closeFileView } =
    useFileSelection();
  const { data: user } = useUser();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: folder, isLoading: isFolderLoading } = useFolder(
    folderId || ""
  );
  const { data: files, isLoading: isLoadingFiles } = useFolderFiles(
    folderId || ""
  );
  const { data: threads, isLoading: isLoadingThreads } = useFolderThreads(
    folderId || ""
  );
  const { data: collaborators = [], isLoading: isLoadingCollaborators } =
    useFolderCollaborators(folderId || "");

  if (!folderId) {
    return (
      <div className="flex flex-col h-full w-full bg-background items-center justify-center">
        <FolderGit2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-lg">
          Select a folder to view details
        </p>
      </div>
    );
  }

  if (isFolderLoading) {
    return (
      <div className="flex flex-col h-full w-full bg-background">
        <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-border/40">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-32" />
          </div>
        </header>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <div className="w-px h-4 bg-border mx-1" />
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-none tracking-tight">
              {folder?.name || "Folder"}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Folder Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Threads
                </span>
              </div>
              <p className="text-2xl font-bold">{threads?.length || 0}</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Files
                </span>
              </div>
              <p className="text-2xl font-bold">{files?.length || 0}</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Collaborators
                </span>
              </div>
              <p className="text-2xl font-bold">{collaborators?.length || 0}</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Created
                </span>
              </div>
              <p className="text-sm font-medium mt-2">
                {folder?.createdAt
                  ? formatDistanceToNow(new Date(folder.createdAt), {
                      addSuffix: true,
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>

          {/* Collaborators Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Collaborators
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareDialogOpen(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Share Folder
              </Button>
            </div>
            {isLoadingCollaborators ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : collaborators && collaborators.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {collaborator.name?.[0]?.toUpperCase() ||
                          collaborator.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">
                            {collaborator.name || "Unknown"}
                          </h3>
                          {collaborator.isOwner && (
                            <Crown className="w-3 h-3 text-yellow-500 shrink-0" />
                          )}
                          {collaborator.id === user?.id && (
                            <span className="text-xs text-muted-foreground">
                              (You)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
                No collaborators yet. Share this folder to collaborate.
              </div>
            )}
          </section>

          {/* Threads Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Chat Threads
            </h2>
            {isLoadingThreads ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : threads && threads.length > 0 ? (
              <div className="space-y-2">
                {threads.map((thread: Thread) => (
                  <button
                    key={thread.id}
                    onClick={() => router.push(`/chat?threadId=${thread.id}`)}
                    className="w-full p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{thread.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Updated{" "}
                            {formatDistanceToNow(new Date(thread.updatedAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {thread.messages?.length || 0} messages
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
                No threads yet. Create one to start chatting.
              </div>
            )}
          </section>

          {/* Files Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Files
            </h2>
            {isLoadingFiles ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : files && files.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => openFileView(file.id)}
                    className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {file.filename}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.fileSize
                            ? formatBytes(file.fileSize)
                            : "Unknown size"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
                No files yet. Upload files to get started.
              </div>
            )}
          </section>
        </div>
      </div>

      {/* File Metadata Dialog */}
      <FileMetadataDialog
        fileId={selectedFileId}
        open={isFileViewOpen}
        onOpenChange={closeFileView}
      />

      {/* Share Dialog */}
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
