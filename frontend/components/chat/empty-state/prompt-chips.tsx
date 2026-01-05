import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface PromptChipsProps {
  hasNoThreads: boolean;
  prompts: string[];
}

export function PromptChips({ hasNoThreads, prompts }: PromptChipsProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="sm:col-span-2"
    >
      <Card className="border-border/30 shadow-none rounded-3xl">
        <CardContent className="p-3.5 space-y-2.5">
          <p className="text-sm font-semibold">
            {hasNoThreads
              ? "Example questions you can ask"
              : "Try these prompts"}
          </p>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/chat?prefill=${encodeURIComponent(prompt)}`}
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
  );
}
