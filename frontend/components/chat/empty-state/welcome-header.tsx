import { motion } from "framer-motion";
import { Sparkles, Wand2, Plus } from "lucide-react";
import { Sparkles as SparklesEffect } from "@/components/ui/sparkles";
import { fadeInUp } from "@/lib/animation-variants";
import { ActionPill } from "./action-pill";

interface WelcomeHeaderProps {
  hasNoThreads: boolean;
  onNewChat: () => void;
}

export function WelcomeHeader({ hasNoThreads, onNewChat }: WelcomeHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex flex-col gap-2 p-5 overflow-hidden rounded-3xl border border-border/40 bg-background/70"
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
          {hasNoThreads ? "Welcome to Recap" : "Welcome back"}
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
            <Wand2 className="w-5 h-5 text-chart-1" />
          </motion.span>
        </h1>
        <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
          {hasNoThreads
            ? "Your intelligent document assistant. Upload files, organize them in folders, and chat with your knowledge base using AI-powered retrieval."
            : "Continue exploring your documents with intelligent search. Get instant answers with context-aware citations."}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <ActionPill icon={Plus} label="New chat" onClick={onNewChat} />
        </div>
      </div>
    </motion.div>
  );
}
