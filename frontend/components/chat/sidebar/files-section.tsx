"use client";

import { useState } from "react";
import {
  ChevronDown,
  Plus,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File as FileType } from "@/types";

interface FilesSectionProps {
  files?: FileType[];
  isLoading: boolean;
  isUploading: boolean;
  onUploadFile: () => void;
  onFileClick: (fileId: string) => void;
  onDeleteFile: (file: FileType) => void;
}

export function FilesSection({
  files,
  isLoading,
  isUploading,
  onUploadFile,
  onFileClick,
  onDeleteFile,
}: FilesSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between w-full px-2 py-1 group/section">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider hover:text-muted-foreground transition-colors"
        >
          <ChevronDown
            className={`mr-1 size-3 transition-transform ${
              isOpen ? "" : "-rotate-90"
            }`}
          />
          Files ({files?.length || 0})
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 opacity-0 group-hover/section:opacity-100 transition-opacity"
          onClick={onUploadFile}
          disabled={isUploading}
        >
          {isUploading ? (
            <Skeleton className="w-4 h-4 rounded-full" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {isLoading && (
              <div className="px-2 py-1">
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            )}
            {files?.map((file) => (
              <SidebarMenuSubItem key={file.id}>
                <div className="flex items-center w-full group/file">
                  <SidebarMenuSubButton asChild className="flex-1 h-8 text-xs">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFileClick(file.id);
                      }}
                      className="group flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    >
                      <FileText className="size-3.5 opacity-70 group-hover:text-primary transition-colors shrink-0" />
                      <span className="truncate">{file.filename}</span>
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
                          onDeleteFile(file);
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
  );
}
