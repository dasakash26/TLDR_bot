"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import {
  LoginData,
  OtpVerifyData,
  RegistrationData,
  ResendOtpData,
} from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore, User } from "./use-user";

async function getErrorMessage(res: Response) {
  try {
    const data = await res.json();
    if (data.detail) {
      if (Array.isArray(data.detail)) {
        return data.detail.map((err: any) => err.msg).join(", ");
      }
      return data.detail;
    }
    return data.message || "Request failed";
  } catch {
    return res.statusText || "Request failed";
  }
}

export function useRegister(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (data: RegistrationData) => {
      const res = await fetchClient("/user/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("OTP sent to your email");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

export function useVerifyOTP() {
  const router = useRouter();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: async (data: OtpVerifyData) => {
      const res = await fetchClient("/user/verify", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      return res.json();
    },
    onSuccess: (data) => {
      // Store user data if returned from API
      if (data.user) {
        setUser(data.user as User);
      }
      toast.success("OTP verified successfully!");
      router.push("/chat");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Verification failed");
    },
  });
}

export const useResendOTP = () => {
  return useMutation({
    mutationFn: async (data: ResendOtpData) => {
      const res = await fetchClient("/user/resend-otp", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("OTP resent successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend OTP");
    },
  });
};

export function useLogin(onError?: (error: Error) => void) {
  const router = useRouter();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await fetchClient("/user/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      return res.json();
    },
    onSuccess: (data) => {
      if (data.user) {
        setUser(data.user as User);
      }
      toast.success("Logged in successfully!");
      router.push("/chat");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
      onError?.(error);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { clearUser } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      const res = await fetchClient("/user/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }
      return res.json();
    },
    onSuccess: () => {
      clearUser();
      toast.success("Logged out successfully!");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });
}
