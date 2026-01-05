"use client";

import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input";
import { ArrowLeft, Mail, Clock } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  otp: string;
  isLoading: boolean;
  isLogin?: boolean;
  onOtpChange: (otp: string) => void;
  onVerify: () => void;
  onBack: () => void;
  onResend?: () => void;
}

export function OTPVerification({
  email,
  otp,
  isLoading,
  isLogin = true,
  onOtpChange,
  onVerify,
  onBack,
  onResend,
}: OTPVerificationProps) {
  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
          {isLogin ? "Check your inbox" : "Verify your email"}
        </h2>
        <p className="text-muted-foreground">
          We sent a 6-digit verification code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        {/* Info box */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">
              Code sent via email
            </p>
            <p className="text-muted-foreground">
              Check your inbox (and spam folder). The code expires in 24 hours.
            </p>
          </div>
        </div>

        <OTPInput value={otp} onChange={onOtpChange} onComplete={onVerify} />

        <Button
          type="button"
          onClick={onVerify}
          disabled={otp.length !== 6 || isLoading}
          className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading
            ? "Verifying..."
            : isLogin
            ? "Verify & Log In"
            : "Verify & Create Account"}
        </Button>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {isLogin ? "email" : "registration"}
          </button>

          {onResend && (
            <button
              type="button"
              onClick={onResend}
              disabled={isLoading}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Didn't receive the code?{" "}
              <span className="font-medium text-foreground">Resend</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
