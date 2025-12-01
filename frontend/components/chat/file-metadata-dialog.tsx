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
  HardDrive,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface FileMetadataDialogProps {
  fileId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileMetadataDialog({
  fileId,
  open,
  onOpenChange,
}: FileMetadataDialogProps) {
  const { data: file, isLoading } = useFileDetails(fileId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            File Details
          </DialogTitle>
          <DialogDescription>
            Metadata and information about this document.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : file ? (
          <div className="grid gap-4 py-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <FileText className="w-8 h-8 text-primary mt-1" />
              <div className="space-y-1 overflow-hidden">
                <h4
                  className="font-medium leading-none truncate"
                  title={file.file_name}
                >
                  {file.file_name}
                </h4>
                <p className="text-xs text-muted-foreground uppercase">
                  {file.type || "Unknown Type"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <p className="text-xs text-muted-foreground mb-1">Source URL</p>
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
      </DialogContent>
    </Dialog>
  );
}
