export interface Message {
  id: string;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
  citations?: {
    id: string;
    title: string;
    page: number;
    content?: string;
    total_pages?: number;
    file_size?: number;
  }[];
}

export interface Thread {
  id: string;
  name: string;
  folderId: string;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface File {
  id: string;
  filename: string;
  uploaderId: string;
  folderId: string;
  status: string;
  fileUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  folderName?: string;
  uploaderName?: string;
  fileSize?: number;
  pageCount?: number;
  type?: string;
}

export interface Folder {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  files?: File[];
  threads?: Thread[];
}

export interface FolderCollaborator {
  id: string;
  name: string | null;
  email: string;
  isOwner: boolean;
}

export interface UserSearchResult {
  id: string;
  name: string | null;
  email: string;
}

export interface CreateThreadData {
  folder_id: string;
  thread_name: string;
}

export interface CreateThreadResponse {
  id: string;
  name: string;
  folderId: string;
  createdAt: string;
}

export interface UpdateThreadData {
  thread_id: string;
  new_name: string;
}

export interface ChatData {
  message: string;
}
