"use client";

import { Button } from "@/components/ui/button";
import { Share, MoreHorizontal, FileText } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { FileMetadataDialog } from "./file-metadata-dialog";

export function MessageItem({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "USER";
  const [selectedCitation, setSelectedCitation] = useState<any>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-4 w-full group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border border-border/50 mt-1 shadow-sm">
          <AvatarImage src="/bot-avatar.png" />
          <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/5 text-primary text-[10px] font-bold">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[85%] md:max-w-[75%]",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "px-5 py-3.5 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-[20px] rounded-tr-sm"
              : "bg-card border border-border/50 text-foreground rounded-[20px] rounded-tl-sm"
          )}
        >
          <div className="whitespace-pre-wrap font-normal">
            {isUser ? (
              message.content
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none break-word">
                {message.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">
                          {children}
                          {isStreaming && (
                            <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary/50 animate-pulse" />
                          )}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                          {children}
                        </a>
                      ),
                      code: ({ className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && !className;
                        return isInline ? (
                          <code
                            className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-xs"
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <code
                            className="block bg-muted p-2 rounded-lg font-mono text-xs overflow-x-auto my-2"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 mb-2 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-4 mb-2 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="pl-1">{children}</li>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  isStreaming && (
                    <div className="flex space-x-1 h-6 items-center">
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-[bounce_1s_infinite_0ms]" />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-[bounce_1s_infinite_200ms]" />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-[bounce_1s_infinite_400ms]" />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Citations (Only for Assistant) */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 pl-1">
            {message.citations.map((citation, index) => (
              <motion.button
                key={`${citation.id}-${index}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCitation(citation)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground hover:bg-background hover:text-foreground hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <FileText className="w-3 h-3 text-primary/70" />
                {citation.title.toString()}
                <span className="opacity-40 border-l border-border pl-1.5 ml-0.5">
                  p.{citation.page}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Message Actions (Hidden by default, shown on hover) */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <Share className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 border border-border/50 mt-1 shadow-sm">
          <AvatarImage src="/user-avatar.png" />
          <AvatarFallback className="bg-linear-to-br from-secondary to-secondary/50 text-secondary-foreground text-[10px] font-bold">
            ME
          </AvatarFallback>
        </Avatar>
      )}

      <FileMetadataDialog
        open={!!selectedCitation}
        onOpenChange={(open) => !open && setSelectedCitation(null)}
        fileId={selectedCitation?.id || null}
        citation={selectedCitation}
      />
    </motion.div>
  );
}
