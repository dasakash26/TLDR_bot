"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page by default
    router.push("/auth/login");
  }, [router]);

  return null;
}
