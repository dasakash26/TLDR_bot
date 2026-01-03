"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import { FolderCollaborator, UserSearchResult } from "@/types";
import { createMutation } from "./use-mutation-factory";

// --- Collaborator Queries ---

export function useFolderCollaborators(folderId: string) {
  return useQuery({
    queryKey: ["folder", folderId, "collaborators"],
    queryFn: async () => {
      if (!folderId) return [];
      const res = await fetchClient(`/folder/${folderId}/collaborators`);
      if (!res.ok) throw new Error("Failed to fetch collaborators");
      return res.json() as Promise<FolderCollaborator[]>;
    },
    enabled: !!folderId,
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await fetchClient(
        `/user/search?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to search users");
      return res.json() as Promise<UserSearchResult[]>;
    },
    enabled: query.length >= 2,
  });
}

// --- Sharing Mutations ---

export const useAddCollaborator = createMutation<
  any,
  { folderId: string; userEmail: string }
>({
  mutationFn: async ({ folderId, userEmail }) => {
    const res = await fetchClient(
      `/folder/${folderId}/add_user?new_user_email=${encodeURIComponent(
        userEmail
      )}`,
      { method: "POST" }
    );
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to add collaborator");
    }
    return res.json();
  },
  invalidateKeys: [],
  successMessage: "Collaborator added successfully",
  errorMessage: "Failed to add collaborator",
  onSuccessCallback: (data, variables, queryClient) => {
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folderId, "collaborators"],
    });
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folderId],
    });
  },
});

export const useRemoveCollaborator = createMutation<
  any,
  { folderId: string; userEmail: string }
>({
  mutationFn: async ({ folderId, userEmail }) => {
    const res = await fetchClient(
      `/folder/${folderId}/remove_user?user_email=${encodeURIComponent(
        userEmail
      )}`,
      { method: "POST" }
    );
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to remove collaborator");
    }
    return res.json();
  },
  invalidateKeys: [],
  successMessage: "Collaborator removed successfully",
  errorMessage: "Failed to remove collaborator",
  onSuccessCallback: (data, variables, queryClient) => {
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folderId, "collaborators"],
    });
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folderId],
    });
  },
});
