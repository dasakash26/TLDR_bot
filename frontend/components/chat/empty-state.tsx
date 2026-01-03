"use client";

import { useState } from "react";
import { Sparkles, Clock, Plus, Wand2, UploadCloud } from "lucide-react";
import { useRecentThreads, useFolders } from "@/hooks/use-chat";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles as SparklesEffect } from "@/components/ui/sparkles";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { NewChatDialog } from "@/components/new-chat-dialog";
import { ActionPill } from "./empty-state/action-pill";
import { RecentThreadCard } from "./empty-state/recent-thread-card";
import { SuggestionCard } from "./empty-state/suggestion-card";
import { EmptyStateLoadingSkeleton } from "./empty-state/loading-skeleton";
import { fadeInUp, fadeInStagger } from "@/lib/animation-variants";

type Thread = {
  id: string;
  name: string;
  folderName?: string;
  updatedAt: string | number | Date;
};

const SUGGESTION_CHIPS = [
  "Summarize my recent chats",
  "Find key decisions made",
  "What's in my latest uploads?",
  "Search all conversations",
];

export default function EmptyState() {
  const { data: recentThreads, isLoading: isLoadingThreads } =
    useRecentThreads();
  const { data: folders, isLoading: isLoadingFolders } = useFolders();
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);

  if (isLoadingThreads || isLoadingFolders) {
    return <EmptyStateLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <header className="flex-none h-14 px-4 flex items-center border-b border-border/40 bg-background/80 backdrop-blur-md z-10">
        <SidebarTrigger className="-ml-1" />
      </header>
      <div className="flex flex-col flex-1 overflow-y-auto p-4 md:p-5">
        <motion.div
          className="w-full max-w-2xl mx-auto space-y-4.5"
          variants={fadeInStagger}
          initial="initial"
          animate="animate"
        >
          {/* Welcome Section */}
          <motion.div
            variants={fadeInUp}
            className="relative flex flex-col gap-2 p-5 overflow-hidden rounded-2xl border border-border/40 bg-background/70"
          >
            <SparklesEffect
              color="hsl(var(--primary))"
              count={18}
              minSize={2}
              maxSize={4}
              speed={0.3}
              className="opacity-30"
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5" />
                AI recap assistant
              </div>
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2 mt-2">
                Welcome back
                <motion.span
                  animate={{ y: [0, -2, 0], rotate: [0, -1, 1, 0] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="inline-flex"
                >
                  <Wand2 className="w-5 h-5 text-primary" />
                </motion.span>
              </h1>
              <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
                Ask questions about your files and chat history. Get instant
                summaries and insights.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <ActionPill
                  icon={Plus}
                  label="New chat"
                  onClick={() => setIsNewChatDialogOpen(true)}
                />
                <ActionPill
                  href="/chat?intent=upload"
                  icon={UploadCloud}
                  label="Upload files"
                  variant="ghost"
                />
              </div>
            </div>
          </motion.div>

          {/* Recent Threads & Suggestions */}
          <motion.div
            className="flex flex-col gap-3.5 items-stretch"
            variants={fadeInUp}
          >
            {/* Recent Threads */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Chats
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {recentThreads?.length
                    ? `${recentThreads.length} conversations`
                    : "Nothing yet"}
                </span>
              </div>

              {recentThreads && recentThreads.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {(recentThreads as Thread[]).map((thread) => (
                    <RecentThreadCard key={thread.id} thread={thread} />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No recent chats yet.
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Quick actions
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <SuggestionCard
                  title="Chat with files"
                  description="Upload documents and ask questions. Works with PDFs, docs, and more."
                  cta="Start chatting"
                  href="/chat"
                />
                <SuggestionCard
                  title="Browse uploaded files"
                  description="View and organize your documents in folders."
                  cta="View files"
                  href="/chat"
                />

                {/* Prompt Chips */}
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="sm:col-span-2"
                >
                  <Card className="border-border/30 shadow-none">
                    <CardContent className="p-3.5 space-y-2.5">
                      <p className="text-sm font-semibold">Try these prompts</p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTION_CHIPS.map((prompt, index) => (
                          <motion.div
                            key={prompt}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              href={`/chat?prefill=${encodeURIComponent(
                                prompt
                              )}`}
                              className="inline-block px-3 py-1.5 rounded-full bg-muted/60 text-[12px] text-muted-foreground border border-border/40 hover:border-primary/40 hover:text-foreground hover:bg-muted transition-colors"
                            >
                              {prompt}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <NewChatDialog
        open={isNewChatDialogOpen}
        onOpenChange={setIsNewChatDialogOpen}
        folders={folders}
      />
    </div>
  );
}
