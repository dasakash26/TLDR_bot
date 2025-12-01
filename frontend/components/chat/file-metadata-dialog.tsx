"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFileDetails } from "@/hooks/use-chat";
import {
  FileText,
  Calendar,
  User,
  Folder,
  Activity,
  Quote,
  Layers,
  HardDrive,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes } from "@/lib/utils";

interface Citation {
  id: string;
  title: string;
  page: number;
  content?: string;
  total_pages?: number;
  file_size?: number;
}

interface FileMetadataDialogProps {
  fileId: string | null;
  citation?: Citation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileMetadataDialog({
  fileId,
  citation,
  open,
  onOpenChange,
}: FileMetadataDialogProps) {
  const { data: file, isLoading } = useFileDetails(fileId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {citation ? "Citation Details" : "File Details"}
          </DialogTitle>
          <DialogDescription>
            {citation
              ? "Source content and file metadata."
              : "Metadata and information about this document."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : file ? (
            <div className="grid gap-6 py-4">
              {/* File Header */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <FileText className="w-8 h-8 text-primary mt-1" />
                <div className="space-y-1 overflow-hidden">
                  <h4
                    className="font-medium leading-none line-clamp-2 break-all"
                    title={file.file_name}
                  >
                    {file.file_name}
                  </h4>
                  <p className="text-xs text-muted-foreground uppercase">
                    {file.type || "Unknown Type"}
                  </p>
                </div>
              </div>

              {/* Citation Specifics */}
              {citation && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Quote className="w-4 h-4 text-primary" />
                    Citation Content
                  </h4>
                  <div className="rounded-md border bg-muted/20 p-4">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-muted-foreground">
                      {citation.content || "No content available."}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Page {citation.page}</span>
                      {citation.total_pages && (
                        <span className="text-muted-foreground">
                          of {citation.total_pages}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* File Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Folder className="w-3 h-3" />
                    Folder
                  </div>
                  <p className="text-sm font-medium truncate">
                    {file.folder_name}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    Uploaded By
                  </div>
                  <p className="text-sm font-medium truncate">
                    {file.uploaded_by}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Uploaded
                  </div>
                  <p className="text-sm font-medium">
                    {file.created_at
                      ? format(new Date(file.created_at), "PP p")
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HardDrive className="w-3 h-3" />
                    Size
                  </div>
                  <p className="text-sm font-medium">
                    {file.size
                      ? formatBytes(Number(file.size))
                      : citation?.file_size
                      ? formatBytes(citation.file_size)
                      : "Unknown"}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    Status
                  </div>
                  <Badge
                    variant={
                      file.status === "COMPLETED" ? "default" : "secondary"
                    }
                    className="text-[10px] h-5"
                  >
                    {file.status || "UNKNOWN"}
                  </Badge>
                </div>
              </div>

              {/* Additional details if available */}
              {file.file_url && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Source URL
                  </p>
                  <div className="p-2 bg-muted rounded text-xs break-all font-mono">
                    {file.file_url}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Failed to load file details.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
