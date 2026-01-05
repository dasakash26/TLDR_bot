import { motion } from "framer-motion";
import {
  FolderOpen,
  UploadCloud,
  MessageSquare,
  FileSearch,
  Zap,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fadeInUp } from "@/lib/animation-variants";
import { TutorialStep } from "./tutorial-step";

const TUTORIAL_STEPS = [
  {
    icon: FolderOpen,
    title: "Create a Folder",
    description: "Organize your documents by project or topic",
    color: "text-chart-1",
  },
  {
    icon: UploadCloud,
    title: "Upload Documents",
    description: "Add PDFs, Word docs, or text files",
    color: "text-chart-2",
  },
  {
    icon: MessageSquare,
    title: "Start Chatting",
    description: "Ask questions about your documents",
    color: "text-chart-3",
  },
  {
    icon: FileSearch,
    title: "Get AI Insights",
    description: "Receive intelligent answers with citations",
    color: "text-chart-1",
  },
];

export function TutorialSection() {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="border-border/30 shadow-none rounded-3xl overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-semibold">How it works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TUTORIAL_STEPS.map((step, index) => (
              <TutorialStep key={index} {...step} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Pro tip:</strong> You can
                upload multiple files to a folder and ask questions across all
                of them. The AI will search through your documents and provide
                answers with source citations.
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
