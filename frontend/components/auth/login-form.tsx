"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Github } from "lucide-react";
import Link from "next/link";
import { useLogin, useResendOTP, useVerifyOTP } from "@/hooks/use-auth";
import { OTPVerification } from "./otp-verification";
import { motion, AnimatePresence } from "framer-motion";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const { mutate: login, isPending: isLoggingIn } = useLogin((error) => {
    if (error.message.includes("Account not verified")) {
      setShowOTP(true);
      resendOtp({ email });
    }
  });

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOTP();
  const { mutate: resendOtp, isPending: isResending } = useResendOTP();

  const isLoading = isLoggingIn || isVerifying || isResending;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login({ email, password });
    }
  };

  const handleOTPVerify = () => {
    verifyOtp({ email, otp });
  };

  const handleResendOTP = () => {
    resendOtp({ email });
  };

  return (
    <AnimatePresence mode="wait">
      {showOTP ? (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <OTPVerification
            email={email}
            otp={otp}
            isLoading={isLoading}
            isLogin={true}
            onOtpChange={setOtp}
            onVerify={handleOTPVerify}
            onBack={() => setShowOTP(false)}
            onResend={handleResendOTP}
          />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
                Sign in
              </h2>
              <p className="text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-foreground"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-foreground hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
