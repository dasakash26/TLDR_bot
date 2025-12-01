"use client";

import { motion } from "framer-motion";
import { AuthBranding } from "@/components/auth/auth-branding";
import { LoginForm } from "@/components/auth/login-form";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Informative Branding */}
      <AuthBranding type="login" />

      {/* Right Side - Auth Form */}
      <div className="relative flex items-center justify-center p-8 bg-background">
        <div className="absolute top-8 right-8">
          <ModeToggle />
        </div>

        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link
              href="/"
              className="text-2xl font-bold text-foreground tracking-tight"
            >
              RECAP
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoginForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
