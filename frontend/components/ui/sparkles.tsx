"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface SparklesProps {
  className?: string;
  color?: string;
  minSize?: number;
  maxSize?: number;
  count?: number;
  speed?: number;
}

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const Sparkles = ({
  className,
  color = "currentColor",
  minSize = 1,
  maxSize = 3,
  count = 20,
  speed = 1,
}: SparklesProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: count }).map((_, i) => ({
        id: `${i}-${Date.now()}`,
        x: random(0, 100),
        y: random(0, 100),
        size: random(minSize, maxSize),
        color: color,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, [count, minSize, maxSize, color]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {sparkles.map((sparkle) => (
        <SparkleItem key={sparkle.id} sparkle={sparkle} speed={speed} />
      ))}
    </div>
  );
};

const SparkleItem = ({
  sparkle,
  speed,
}: {
  sparkle: Sparkle;
  speed: number;
}) => {
  return (
    <motion.span
      className="absolute rounded-full bg-current"
      style={{
        left: `${sparkle.x}%`,
        top: `${sparkle.y}%`,
        width: sparkle.size,
        height: sparkle.size,
        color: sparkle.color,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, random(-20, 20)],
        x: [0, random(-20, 20)],
      }}
      transition={{
        duration: random(1, 2) / speed,
        repeat: Infinity,
        delay: random(0, 2),
        ease: "easeInOut",
      }}
    />
  );
};
