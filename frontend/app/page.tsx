"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  ArrowRight,
  Sparkles,
  FolderGit2,
  Users,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex flex-col selection:bg-primary/20">
      {/* Floating Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex items-center justify-between px-6 py-3 w-full max-w-4xl rounded-full border border-border/40 bg-background/80 backdrop-blur-xl shadow-sm transition-all hover:border-primary/20 hover:shadow-md dark:bg-secondary/30 dark:border-white/10">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            RECAP
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium text-muted-foreground hover:text-foreground rounded-full px-4"
              >
                Log In
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="sm"
                className="font-semibold rounded-full px-5 shadow-lg shadow-primary/20 h-9 text-sm"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6">
        {/* Sleek Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[100px] rounded-full opacity-30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col h-full justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Now with real-time collaboration
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground">
              Your documents, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary/80 to-accent-foreground">
                intelligent & alive.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed font-light">
              Stop searching, start asking. Upload your research, invite your
              team, and get instant, cited answers from your entire knowledge
              base.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
              <Link href="/chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"
                >
                  Start analyzing for free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Modern Feature Grid - Compact for 100vh */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 text-left pb-12 w-full"
          >
            <FeatureCard
              icon={<FolderGit2 className="w-5 h-5 text-primary" />}
              title="Smart Workspaces"
              description="Create dedicated folders for projects. Upload PDFs, docs, and text files."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5 text-primary" />}
              title="Team Collaboration"
              description="Invite colleagues to your folders. Share insights and work together."
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5 text-primary" />}
              title="Precision Citations"
              description="Trust but verify. Every AI response includes direct links to sources."
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-5 rounded-2xl bg-card/30 border border-border/40 hover:bg-card/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 backdrop-blur-sm dark:bg-secondary/10 dark:border-white/5 dark:hover:bg-secondary/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-base font-bold text-foreground tracking-tight">
          {title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {description}
      </p>
    </div>
  );
}
