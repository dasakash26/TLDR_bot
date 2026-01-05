import { motion } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FirstChatCardProps {
  onClick: () => void;
}

export function FirstChatCard({ onClick }: FirstChatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="border-border/30 shadow-none rounded-3xl h-full bg-gradient-to-br from-chart-1/5 to-chart-2/10 border-chart-1/20 hover:border-chart-1/30 transition-colors">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-chart-1/10">
              <Plus className="w-4 h-4 text-chart-1" />
            </div>
            <p className="text-sm font-semibold">Create Your First Chat</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
            Choose a folder and start your first conversation with your
            documents.
          </p>
          <div className="flex items-center gap-1 text-xs font-medium text-chart-1 mt-3">
            Start now <ArrowRight className="w-3 h-3" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
