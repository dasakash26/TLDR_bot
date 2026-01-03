"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import { Thread, CreateThreadResponse, CreateThreadData, UpdateThreadData } from "@/types";
import { createMutation } from "./use-mutation-factory";

// --- Thread Queries ---

export function useThread(threadId: string) {
  return useQuery({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      if (!threadId) return null;
      const res = await fetchClient(`/thread/${threadId}`);
      if (!res.ok) throw new Error("Failed to fetch thread");
      const data = await res.json();
      return data.thread as Thread;
    },
    enabled: !!threadId,
  });
}

export function useFolderThreads(folderId: string) {
  return useQuery({
    queryKey: ["folder", folderId, "threads"],
    queryFn: async () => {
      if (!folderId) return [];
      const res = await fetchClient(`/thread/all?folder_id=${folderId}`);
      if (!res.ok) throw new Error("Failed to fetch threads");
      const data = await res.json();
      return data.threads as Thread[];
    },
    enabled: !!folderId,
  });
}

export function useRecentThreads() {
  return useQuery({
    queryKey: ["recent-threads"],
    queryFn: async () => {
      const res = await fetchClient("/thread/recent/all");
      if (!res.ok) throw new Error("Failed to fetch recent threads");
      const data = await res.json();
      return data.threads as (Thread & { folderName: string })[];
    },
  });
}

// --- Thread Mutations ---

export const useCreateThread = createMutation<
CreateThreadResponse,
  CreateThreadData
>({
  mutationFn: async (data: CreateThreadData) => {
    const res = await fetchClient(`/thread/`, {
      method: "POST",
      body: JSON.stringify({
        folder_id: data.folder_id,
        thread_name: data.thread_name,
      }),
    });
    if (!res.ok) throw new Error("Failed to create thread");
    return res.json();
  },
  invalidateKeys: [["folders"], ["recent-threads"]],
  successMessage: "Thread created successfully",
  errorMessage: "Failed to create thread",
  onSuccessCallback: (data, variables, queryClient) => {
    // Also invalidate the specific folder and its threads
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folder_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folder_id, "threads"],
    });
  },
});

export const useUpdateThread = createMutation<any,UpdateThreadData>({
  mutationFn: async (data: UpdateThreadData) => {
    const res = await fetchClient(`/thread/${data.thread_id}`, {
      method: "PUT",
      body: JSON.stringify({ new_name: data.new_name }),
    });
    if (!res.ok) throw new Error("Failed to update thread");
    return res.json();
  },
  invalidateKeys: [["folders"], ["recent-threads"]],
  successMessage: "Thread updated successfully",
  errorMessage: "Failed to update thread",
  onSuccessCallback: (data, variables, queryClient) => {
    // Also invalidate the specific thread query
    queryClient.invalidateQueries({
      queryKey: ["thread", variables.thread_id],
    });
  },
});

export const useDeleteThread = createMutation({
  mutationFn: async (threadId: string) => {
    const res = await fetchClient(`/thread/${threadId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete thread");
    return res.json();
  },
  invalidateKeys: [["folders"], ["recent-threads"]],
  successMessage: "Thread deleted successfully",
  errorMessage: "Failed to delete thread",
});
