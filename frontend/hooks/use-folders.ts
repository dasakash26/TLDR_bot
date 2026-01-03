"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import { Folder, File } from "@/types";
import { createMutation } from "./use-mutation-factory";

// --- Folder Queries ---

export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await fetchClient("/folder/");
      if (!res.ok) throw new Error("Failed to fetch folders");
      return res.json() as Promise<Folder[]>;
    },
  });
}

export function useFolder(folderId: string) {
  return useQuery({
    queryKey: ["folder", folderId],
    queryFn: async () => {
      if (!folderId) return null;
      const res = await fetchClient(`/folder/${folderId}`);
      if (!res.ok) throw new Error("Failed to fetch folder");
      return res.json() as Promise<Folder>;
    },
    enabled: !!folderId,
  });
}

export function useFolderFiles(folderId: string) {
  return useQuery({
    queryKey: ["folder", folderId, "files"],
    queryFn: async () => {
      if (!folderId) return [];
      const res = await fetchClient(`/folder/${folderId}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      return res.json() as Promise<File[]>;
    },
    enabled: !!folderId,
  });
}

// --- Folder Mutations ---

export const useCreateFolder = createMutation({
  mutationFn: async (name: string) => {
    const res = await fetchClient(
      `/folder/?folder_name=${encodeURIComponent(name)}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error("Failed to create folder");
    return res.json();
  },
  invalidateKeys: [["folders"]],
  successMessage: "Folder created successfully",
  errorMessage: "Failed to create folder",
});

export const useDeleteFolder = createMutation({
  mutationFn: async (folderId: string) => {
    const res = await fetchClient(`/folder/${folderId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete folder");
    return res.json();
  },
  invalidateKeys: [["folders"], ["recent-threads"]],
  successMessage: "Folder deleted successfully",
  errorMessage: "Failed to delete folder",
  onSuccessCallback: (data, folderId, queryClient) => {
    // Also clear specific folder queries
    queryClient.removeQueries({ queryKey: ["folder", folderId] });
    queryClient.removeQueries({ queryKey: ["folder", folderId, "files"] });
    queryClient.removeQueries({ queryKey: ["folder", folderId, "threads"] });
  },
});

export const useUpdateFolder = createMutation<
  any,
  { folderId: string; newName: string }
>({
  mutationFn: async ({ folderId, newName }) => {
    const res = await fetchClient(`/folder/${folderId}`, {
      method: "PUT",
      body: JSON.stringify({ new_name: newName }),
    });
    if (!res.ok) throw new Error("Failed to update folder");
    return res.json();
  },
  invalidateKeys: [["folders"]],
  successMessage: "Folder updated successfully",
  errorMessage: "Failed to update folder",
  onSuccessCallback: (data, variables, queryClient) => {
    // Also invalidate the specific folder query
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folderId],
    });
  },
});
