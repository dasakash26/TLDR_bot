"use client";

// Folder hooks
export {
  useFolders,
  useFolder,
  useFolderFiles,
  useCreateFolder,
  useDeleteFolder,
  useUpdateFolder,
} from "./use-folders";

// Thread hooks
export {
  useThread,
  useFolderThreads,
  useRecentThreads,
  useCreateThread,
  useUpdateThread,
  useDeleteThread,
} from "./use-threads";

// File hooks
export { useFileDetails, useUploadFile, useDeleteFile } from "./use-files";

// Chat messaging hook
export { useChatMessaging as useChat } from "./use-chat-messaging";

// Re-export types for convenience
export type {
  Folder,
  Thread,
  File,
  Message,
  CreateThreadData,
  UpdateThreadData,
} from "../types";
