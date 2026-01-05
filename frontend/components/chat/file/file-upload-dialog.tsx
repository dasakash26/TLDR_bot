"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/use-chat";

interface FileUploadDialogProps {
  folderId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FileUploadDialog({
  folderId,
  isOpen,
  onOpenChange,
}: FileUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { mutate: uploadFile, isPending: isUploadingFile } = useUploadFile();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Knowledge</DialogTitle>
          <DialogDescription>
            Add documents to your folder context.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.txt,.docx,.md"
          />

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors gap-2",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className="p-3 bg-background rounded-full shadow-sm border">
                <UploadCloud className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  Click to select or drag file here
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, TXT (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 relative group">
              <div className="p-2 bg-background rounded-md border shadow-sm">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between flex-row items-center">
          {file ? (
            <p className="text-xs text-muted-foreground hidden sm:block">
              Ready to upload
            </p>
          ) : <div />}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploadingFile}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (file) {
                  uploadFile({
                    folderId,
                    file
                  }, {
                    onSuccess: () => {
                      setFile(null);
                      onOpenChange(false);
                    },
                  });
                }
              }}
              disabled={!file || isUploadingFile}
            >
              {isUploadingFile ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
