"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sparkles, Download, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useThread } from "@/hooks/use-chat";
import { useState } from "react";
import { ChatAnalyticsDialog } from "./chat-analytics-dialog";

interface ChatHeaderProps {
  threadName?: string;
}

export function ChatHeader({ threadName }: ChatHeaderProps) {
  const searchParams = useSearchParams();
  const threadId = searchParams.get("threadId");
  const { data: thread } = useThread(threadId || "");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleExportMarkdown = () => {
    if (!thread?.messages || thread.messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    const markdown = thread.messages
      .map((msg) => {
        const role = msg.role === "USER" ? "**You**" : "**AI**";
        return `${role}\n\n${msg.content}`;
      })
      .join("\n\n---\n\n");

    const header = `# ${
      threadName || "Chat"
    }\n\n*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;
    const fullMarkdown = header + markdown;

    const blob = new Blob([fullMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${threadName || "chat"}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Chat exported as Markdown");
  };

  const handleExportText = () => {
    if (!thread?.messages || thread.messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    const text = thread.messages
      .map((msg) => {
        const role = msg.role === "USER" ? "You" : "AI";
        return `${role}:\n${msg.content}`;
      })
      .join("\n\n" + "=".repeat(50) + "\n\n");

    const header = `${
      threadName || "Chat"
    }\nExported on ${new Date().toLocaleString()}\n\n${"=".repeat(50)}\n\n`;
    const fullText = header + text;

    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${threadName || "chat"}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Chat exported as text");
  };

  return (
    <header className="flex-none h-14 px-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <div className="w-px h-4 bg-border mx-1" />
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground leading-none tracking-tight">
            {threadName || "Chat"}
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">
            Thread
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ChatAnalyticsDialog
          thread={thread||undefined}
          open={showAnalytics}
          onOpenChange={setShowAnalytics}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
              title="Export chat"
            >
              <Download className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleExportMarkdown}>
              <FileText className="w-4 h-4 mr-2" />
              Export as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportText}>
              <FileText className="w-4 h-4 mr-2" />
              Export as Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-px h-4 bg-border mx-1" />
        <ModeToggle />
      </div>
    </header>
  );
}
