import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TutorialStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  index: number;
}

export function TutorialStep({
  icon: Icon,
  title,
  description,
  color,
  index,
}: TutorialStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="relative group"
    >
      <div className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 hover:border-border/50 hover:bg-muted/50 transition-all">
        <div className="flex-shrink-0">
          <div className="relative">
            <div
              className={`p-2 rounded-lg bg-background border border-border/40 ${color}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {index + 1}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium mb-0.5">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
