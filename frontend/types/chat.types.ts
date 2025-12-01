export interface Message {
  id: string;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
  citations?: { id: number; title: string; page: number }[];
}

export interface Thread {
  id: string;
  name: string;
  folder_id: string;
  messages?: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface File {
  file_id: string;
  file_name: string;
  uploaded_by: string;
  // Extended details
  status?: string;
  file_url?: string | null;
  created_at?: string;
  updated_at?: string;
  folder_name?: string;
  uploader_name?: string;
  size?: string;
  type?: string;
}

export interface Folder {
  folder_id: string;
  name: string;
  created_by: string;
  files?: File[];
  threads?: Thread[];
}

export interface CreateThreadData {
  folder_id: string;
  thread_name: string;
}

export interface UpdateThreadData {
  thread_id: string;
  new_name: string;
}

export interface ChatData {
  message: string;
}
