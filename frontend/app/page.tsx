"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  ArrowRight,
  Sparkles,
  FolderGit2,
  Users,
  FileText,
  Upload,
  MessageSquare,
  Search,
  Github,
  Twitter,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import { Card, CardContent } from "@/components/ui/card";

const Features = [
  {
    icon: FolderGit2,
    title: "Context Isolation",
    description:
      "Stop mixing research. Group data into high-density project silos for zero-noise retrieval.",
  },
  {
    icon: Users,
    title: "Collective Brain",
    description:
      "Sync your team's knowledge instantly. One workspace that serves as your team's shared source of truth.",
  },
  {
    icon: FileText,
    title: "Audit-Ready AI",
    description:
      "End hallucinations. Every answer is backed by a direct link to the exact sentence in your source.",
  },
];

const HowItWorks = [
  {
    icon: FolderGit2,
    step: "1",
    title: "Create Folders",
    description: "Organize your documents by project, topic, or team.",
  },
  {
    icon: Upload,
    step: "2",
    title: "Upload Documents",
    description: "Add PDFs, Word docs, or text files to your folders.",
  },
  {
    icon: MessageSquare,
    step: "3",
    title: "Chat with Your Data",
    description: "Ask questions and get instant answers with citations.",
  },
  {
    icon: Search,
    step: "4",
    title: "Get AI Insights",
    description: "Receive intelligent answers backed by your documents.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Floating Navigation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav className="flex items-center justify-between px-6 md:px-8 py-3 md:py-3.5 w-full max-w-5xl rounded-full border border-border/40 bg-background/95 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:scale-[1.02]">
          <div className="flex items-center gap-2 font-bold text-base md:text-lg tracking-tight">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden sm:inline">RECAP</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/chat">
              <Button
                size="sm"
                className="font-semibold rounded-full px-4 md:px-5 shadow-lg shadow-primary/20 h-8 md:h-9 text-xs md:text-sm"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[400px] md:h-[600px] bg-gradient-to-br from-primary/20 via-chart-1/15 to-chart-2/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-gradient-to-tl from-chart-2/20 via-primary/10 to-transparent blur-[80px] rounded-full" />
          <div className="absolute top-1/3 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-chart-1/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-muted-foreground">
               MVP Launched!
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 leading-[1.1] text-foreground px-4"
            >
              Your documents, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-chart-1 to-chart-2">
                intelligent & alive.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed px-6"
            >
              Upload documents, chat with AI, get cited answers. Built for
              teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full px-6"
            >
              <Link href="/chat" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-sm md:text-base font-semibold rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-chart-1/20 to-chart-2/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">Start Free</span>
                  <ArrowRight className="w-4 h-4 ml-2 relative group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product Screenshot Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-8 py-20 md:py-24 bg-gradient-to-b from-background via-chart-1/5 to-background overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent blur-[80px] rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              See Recap in Action
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Clean interface. Real product.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 25, rotateY: -25 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: "2000px" }}
            className="rounded-2xl border border-border/40 overflow-hidden shadow-2xl bg-card hover:shadow-primary/10 hover:scale-[1.02] transition-all duration-500 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <Image
              src="/recap-demo.png"
              alt="Recap product interface showing chat with documents"
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-8 py-20 md:py-24 bg-gradient-to-b from-background via-muted/30 to-background">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Recap?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Accurate answers from your documents.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-8 py-20 md:py-24 bg-gradient-to-br from-muted/50 via-primary/5 to-muted/50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-chart-1/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-chart-2/10 blur-[100px] rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Four steps to intelligent document search.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {HowItWorks.map((step, index) => (
              <HowItWorksCard key={index} step={step} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-8 py-20 md:py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-chart-2/5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
          >
            Ready to start?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/chat">
              <Button
                size="lg"
                className="h-14 md:h-16 px-10 md:px-12 text-base md:text-lg font-semibold rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-chart-1/30 to-chart-2/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Start Using Recap</span>
                <ArrowRight className="w-5 h-5 ml-2 relative group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 md:py-16 px-6 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                RECAP
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered document search with citations.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@recap.app"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© 2026 Recap. Recap AI.</p>
          </div>
        </div>
      </footer>

      <Analytics />
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof Features)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Card className="group h-full border-border/40 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 md:p-2.5 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-foreground tracking-tight">
              {feature.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function HowItWorksCard({
  step,
  index,
}: {
  step: (typeof HowItWorks)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
      className="relative"
      style={{ perspective: "1000px" }}
    >
      <Card className="h-full border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
            <div className="relative p-3 md:p-4 bg-primary/10 rounded-2xl">
              <step.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {step.step}
            </div>
          </div>
          <h3 className="text-base md:text-lg font-bold mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
