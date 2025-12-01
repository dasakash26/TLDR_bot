"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface AuthBrandingProps {
  type: "login" | "register";
}

export function AuthBranding({ type }: AuthBrandingProps) {
  const isLogin = type === "login";

  return (
    <div className="hidden lg:flex relative bg-sidebar overflow-hidden flex-col justify-between border-r border-sidebar-border">
      {/* Subtle Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-20 bg-primary" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-10 bg-accent" />
      </div>

      {/* Logo */}
      <div className="relative z-10 p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xl font-semibold text-sidebar-foreground tracking-tight hover:opacity-80 transition-opacity"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          RECAP
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-12 pb-24 flex flex-col justify-center flex-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          {isLogin ? (
            <>
              <h1 className="text-4xl md:text-5xl font-medium text-sidebar-foreground mb-6 tracking-tight leading-[1.1]">
                Your research assistant, <br />
                <span className="text-muted-foreground">always ready.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md font-light">
                Continue your analysis with persistent context and instant
                citations across your entire document library.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-medium text-sidebar-foreground mb-6 tracking-tight leading-[1.1]">
                Turn documents into <br />
                <span className="text-muted-foreground">
                  actionable insights.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md font-light">
                Experience the next generation of document intelligence. Powered
                by advanced RAG for precise, cited answers.
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-12 pt-0">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-sidebar-border" />
          <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
            Enterprise Grade Security
          </span>
        </div>
      </div>
    </div>
  );
}
