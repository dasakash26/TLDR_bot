"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import FileUploadDialog from "./file/file-upload-dialog";

interface ChatInputProps {
  folderId: string | null;
  threadId?: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  folderId,
  value,
  onChange,
  onSend,
  onKeyDown,
  disabled = false,
  placeholder = "Ask anything...",
}: ChatInputProps) {
  const [fileUploadOpen, setFileUploadOpen] = useState(false);

  return (
    <div className="p-4 pb-6 bg-linear-to-t from-background via-background to-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex flex-col gap-2 p-2 rounded-[24px] border border-input bg-muted/40 shadow-sm focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring transition-all hover:border-ring/40">
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/50 mb-0.5"
              onClick={() => {
                setFileUploadOpen(true);
              }}
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <TextareaAutosize
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="flex-1 border-0 shadow-none focus:ring-0 focus:outline-none px-2 py-2.5 min-h-[40px] max-h-32 resize-none bg-transparent text-base placeholder:text-muted-foreground/60"
              disabled={disabled}
              minRows={1}
              maxRows={5}
            />

            <Button
              size="icon"
              onClick={onSend}
              className={cn(
                "h-9 w-9 rounded-full shadow-sm transition-all duration-200 mb-0.5",
                value.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              disabled={!value.trim() || disabled}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
            AI-Generated Content • Verify Important Info
          </p>
        </div>
      </div>
      {folderId && (
        <FileUploadDialog
          folderId={folderId}
          isOpen={fileUploadOpen}
          onOpenChange={setFileUploadOpen}
        />
      )}
    </div>
  );
}
