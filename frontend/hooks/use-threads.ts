"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import {
  Thread,
  CreateThreadResponse,
  CreateThreadData,
  UpdateThreadData,
} from "@/types";
import { createMutation } from "./use-mutation-factory";

export function useThread(threadId: string, enableRefetch: boolean = true) {
  return useQuery({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      if (!threadId) return null;
      console.log("[useThread] Fetching thread:", threadId);
      const res = await fetchClient(`/thread/${threadId}`);
      if (!res.ok) {
        console.error(
          "[useThread] Failed to fetch thread:",
          threadId,
          "Status:",
          res.status
        );
        throw new Error("Failed to fetch thread");
      }
      const data = await res.json();
      console.log(
        "[useThread] Fetched thread:",
        data.thread?.id,
        "data:",
        data.thread
      );
      return data.thread as Thread;
    },
    enabled: !!threadId,
    refetchInterval: enableRefetch ? 30000 : false,
    refetchOnWindowFocus: enableRefetch,
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
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folder_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["folder", variables.folder_id, "threads"],
    });
  },
});

export const useUpdateThread = createMutation<
  { id: string; name: string; folderId: string; updatedAt: string },
  UpdateThreadData
>({
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
    queryClient.invalidateQueries({
      queryKey: ["thread", variables.thread_id],
    });

    if (data.folderId) {
      queryClient.invalidateQueries({
        queryKey: ["folder", data.folderId, "threads"],
      });
    }
  },
});

export const useDeleteThread = createMutation<any, string>({
  mutationFn: async (threadId: string) => {
    const res = await fetchClient(`/thread/${threadId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete thread");
    return res.json();
  },
  invalidateKeys: [["folders"], ["recent-threads"]],
  successMessage: "Thread deleted successfully",
  errorMessage: "Failed to delete thread",
  onSuccessCallback: (data, threadId, queryClient) => {
    queryClient.removeQueries({
      queryKey: ["thread", threadId],
    });
    queryClient.invalidateQueries({
      queryKey: ["folders"],
    });
  },
});
