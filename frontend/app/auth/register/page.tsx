"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthBranding } from "@/components/auth/auth-branding";
import { RegisterForm } from "@/components/auth/register-form";
import { OTPVerification } from "@/components/auth/otp-verification";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";
import { useRegister, useVerifyOTP } from "@/hooks/use-auth";

type RegisterStep = "details" | "otp";

export default function RegisterPage() {
  const [step, setStep] = useState<RegisterStep>("details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  const { mutate: register, isPending: isRegistering } = useRegister(() =>
    setStep("otp")
  );
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOTP();

  const isLoading = isRegistering || isVerifying;

  const handleRegisterSubmit = () => {
    register(formData);
  };

  const handleOTPVerify = () => {
    verifyOtp({
      email: formData.email,
      otp,
    });
  };

  const handleResendOTP = () => {
    register(formData);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthBranding type="register" />

      <div className="relative flex items-center justify-center p-8 bg-background">
        <div className="absolute top-8 right-8">
          <ModeToggle />
        </div>

        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link
              href="/"
              className="text-2xl font-bold text-foreground tracking-tight"
            >
              RECAP
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {step === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterForm
                  formData={formData}
                  isLoading={isLoading}
                  onFormDataChange={setFormData}
                  onSubmit={handleRegisterSubmit}
                />
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OTPVerification
                  email={formData.email}
                  otp={otp}
                  isLoading={isLoading}
                  isLogin={false}
                  onOtpChange={setOtp}
                  onVerify={handleOTPVerify}
                  onBack={() => setStep("details")}
                  onResend={handleResendOTP}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
