"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import { File as FileRecord } from "@/types";
import { createMutation } from "./use-mutation-factory";

// --- File Queries ---

export function useFileDetails(fileId: string | null) {
  return useQuery({
    queryKey: ["file", fileId],
    queryFn: async () => {
      if (!fileId) return null;
      const res = await fetchClient(`/file/${fileId}`);
      if (!res.ok) throw new Error("Failed to fetch file details");
      return res.json() as Promise<FileRecord>;
    },
    enabled: !!fileId,
  });
}

// --- File Mutations ---

export const useUploadFile = createMutation<
  any,
  { folderId: string; file: File }
>({
  mutationFn: async ({ folderId, file }) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetchClient(`/file/upload?folder_id=${folderId}`, {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });

    if (!res.ok) throw new Error("Failed to upload file");
    return res.json();
  },
  invalidateKeys: [["folders"]],
  successMessage: "File uploaded successfully",
  errorMessage: "Failed to upload file",
  onSuccessCallback: (data, variables, queryClient) => {
    // Also invalidate the specific folder queries
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folderId],
    });
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folderId, "files"],
    });
  },
});

export const useDeleteFile = createMutation({
  mutationFn: async (fileId: string) => {
    const res = await fetchClient(`/file/${fileId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete file");
    return res.json();
  },
  invalidateKeys: [["folders"]],
  successMessage: "File deleted successfully",
  errorMessage: "Failed to delete file",
  onSuccessCallback: (data, fileId, queryClient) => {
    // Also remove the specific file query
    queryClient.removeQueries({ queryKey: ["file", fileId] });
  },
});
