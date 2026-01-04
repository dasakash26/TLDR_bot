"use client";

import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { File } from "@/types";

interface FilesSectionProps {
  files: File[];
  isLoading: boolean;
  onFileClick: (fileId: string) => void;
}

export function FilesSection({
  files,
  isLoading,
  onFileClick,
}: FilesSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Files
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onClick={() => onFileClick(file.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No files yet. Upload files to get started." />
      )}
    </section>
  );
}

interface FileCardProps {
  file: File;
  onClick: () => void;
}

function FileCard({ file, onClick }: FileCardProps) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-left group"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{file.filename}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {file.fileSize ? formatBytes(file.fileSize) : "Unknown size"}
          </p>
        </div>
      </div>
    </button>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-8 rounded-lg border border-dashed border-border text-center text-muted-foreground">
      {message}
    </div>
  );
}
