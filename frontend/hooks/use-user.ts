"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
);

export function useUser() {
  const { user, setUser, clearUser } = useUserStore();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetchClient("/user/me");

      if (!res.ok) {
        if (res.status === 401) {
          clearUser();
          return null;
        }
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      const userData = data as User;
      setUser(userData);
      return userData;
    },
    enabled: !user,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user || query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
