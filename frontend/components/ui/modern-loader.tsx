"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ModernLoader({ className, size = "md" }: ModernLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <motion.span
        className="absolute w-full h-full border-2 border-primary/30 rounded-full"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute w-full h-full border-t-2 border-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
