"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Github } from "lucide-react";
import Link from "next/link";

interface RegisterFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
  };
  isLoading: boolean;
  onFormDataChange: (data: {
    name: string;
    email: string;
    password: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  formData,
  isLoading,
  onFormDataChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
          Create account
        </h2>
        <p className="text-muted-foreground">
          Get started with your free account
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 text-foreground"
          >
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({ ...formData, name: e.target.value })
            }
            className="h-12 text-base"
            required
            disabled={isLoading}
            autoFocus
          />
        </div>

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
            value={formData.email}
            onChange={(e) =>
              onFormDataChange({ ...formData, email: e.target.value })
            }
            className="h-12 text-base"
            required
            disabled={isLoading}
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
            value={formData.password}
            onChange={(e) =>
              onFormDataChange({ ...formData, password: e.target.value })
            }
            className="h-12 text-base"
            required
            disabled={isLoading}
            minLength={8}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>

        <Button
          type="submit"
          disabled={
            isLoading ||
            !formData.email ||
            !formData.password ||
            !formData.name ||
            formData.password.length < 8
          }
          className="w-full h-12 text-base font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
