import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

interface ActionPillProps {
  href?: string;
  icon: React.ElementType;
  label: string;
  variant?: "primary" | "ghost";
  onClick?: () => void;
}

export function ActionPill({
  href,
  icon: Icon,
  label,
  variant = "primary",
  onClick,
}: ActionPillProps) {
  const className =
    variant === "primary"
      ? "inline-flex items-center gap-1.5 rounded-full bg-chart-1 text-white px-3.5 py-2 text-sm font-medium shadow-sm hover:bg-chart-1/90 hover:shadow transition-all"
      : "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:border-chart-1/40 hover:text-foreground transition-colors";

  const content = (
    <>
      <Icon className="w-4 h-4" />
      {label}
    </>
  );

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      {onClick ? (
        <button onClick={onClick} className={className}>
          {content}
        </button>
      ) : (
        <Link href={href || "#"} className={className}>
          {content}
        </Link>
      )}
    </motion.div>
  );
}
