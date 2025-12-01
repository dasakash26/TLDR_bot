"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/lib/api";
import {
  Folder,
  Thread,
  File as FileRecord,
  CreateThreadData,
  UpdateThreadData,
  ChatData,
  Message,
} from "@/types";
import { toast } from "sonner";
import { useState, useCallback } from "react";

// --- Folders ---

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

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetchClient(
        `/folder/?folder_name=${encodeURIComponent(name)}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Failed to create folder");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder created successfully");
    },
    onError: () => {
      toast.error("Failed to create folder");
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (folderId: string) => {
      const res = await fetchClient(`/folder/${folderId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete folder");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete folder");
    },
  });
}

export function useFolderFiles(folderId: string) {
  return useQuery({
    queryKey: ["folder", folderId, "files"],
    queryFn: async () => {
      if (!folderId) return [];
      const res = await fetchClient(`/folder/${folderId}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      return res.json() as Promise<FileRecord[]>;
    },
    enabled: !!folderId,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      folderId,
      file,
    }: {
      folderId: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", file);

      // Note: The backend expects folder_id as a query parameter based on the route definition
      // @router.post("/upload") ... folder_id: str ...
      const res = await fetchClient(`/file/upload?folder_id=${folderId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["folder", variables.folderId, "files"],
      });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("File uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload file");
    },
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

// --- Threads ---

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

export function useCreateThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateThreadData) => {
      const res = await fetchClient("/thread/", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create thread");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["folder", variables.folder_id, "threads"],
      });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Thread created successfully");
    },
    onError: () => {
      toast.error("Failed to create thread");
    },
  });
}

export function useUpdateThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateThreadData) => {
      const res = await fetchClient(`/thread/${data.thread_id}`, {
        method: "PUT",
        body: JSON.stringify({ new_name: data.new_name }),
      });
      if (!res.ok) throw new Error("Failed to update thread");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["thread", data.thread_id] });
      // We might need to invalidate folder threads too if we knew the folder ID
      // Ideally the backend returns the folder ID or we pass it in variables
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Thread updated successfully");
    },
    onError: () => {
      toast.error("Failed to update thread");
    },
  });
}

export function useDeleteThread() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threadId: string) => {
      const res = await fetchClient(`/thread/${threadId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete thread");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Thread deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete thread");
    },
  });
}

// --- Chat ---

export function useChat(threadId: string) {
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();

  const sendMessage = useCallback(
    async (
      message: string,
      onChunk: (chunk: string) => void,
      onCitation?: (citations: any[]) => void
    ) => {
      setIsStreaming(true);
      try {
        const response = await fetchClient(`/thread/${threadId}/chat`, {
          method: "POST",
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data: ")) continue;

            const dataStr = trimmedLine.slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.type === "message") {
                onChunk(data.content);
              } else if (data.type === "citation") {
                if (onCitation) onCitation(data.citations);
              } else if (data.type === "error") {
                toast.error(data.message);
              } else if (data.type === "done") {
                // Stream finished
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        toast.error("Failed to send message");
      } finally {
        setIsStreaming(false);
        // Invalidate thread to fetch the full saved message history
        queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
      }
    },
    [threadId, queryClient]
  );

  return { sendMessage, isStreaming };
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      folderId,
      newName,
    }: {
      folderId: string;
      newName: string;
    }) => {
      const res = await fetchClient(`/folder/${folderId}`, {
        method: "PUT",
        body: JSON.stringify({ new_name: newName }),
      });
      if (!res.ok) throw new Error("Failed to update folder");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder updated successfully");
    },
    onError: () => {
      toast.error("Failed to update folder");
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fileId: string) => {
      const res = await fetchClient(`/file/${fileId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete file");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      // Also invalidate specific folder files if possible, but folders query covers it for sidebar
      toast.success("File deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete file");
    },
  });
}

export function useRecentThreads() {
  return useQuery({
    queryKey: ["recent-threads"],
    queryFn: async () => {
      const res = await fetchClient("/thread/recent/all");
      if (!res.ok) throw new Error("Failed to fetch recent threads");
      const data = await res.json();
      return data.threads as (Thread & { folder_name: string })[];
    },
  });
}

export function useFileDetails(fileId: string | null) {
  return useQuery({
    queryKey: ["file", fileId],
    queryFn: async () => {
      if (!fileId) return null;
      const res = await fetchClient(`/file/${fileId}`);
      if (!res.ok) throw new Error("Failed to fetch file details");
      const data = await res.json();
      // Map backend response to frontend type if needed, or just return as is
      // Backend returns: id, filename, status, file_url, created_at, updated_at, folder_name, uploader_name, size, type
      return {
        file_id: data.id,
        file_name: data.filename,
        uploaded_by: data.uploader_name, // Mapping for compatibility
        ...data,
      } as FileRecord;
    },
    enabled: !!fileId,
  });
}
