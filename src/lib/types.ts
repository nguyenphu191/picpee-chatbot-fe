export type DocumentStatus = "UPLOADED" | "READY" | "REINDEXING" | "FAILED_EXTRACT";

export interface Document {
  id: string;
  name: string;
  status: DocumentStatus | string;
  page_count: number;
  chunk_count: number;
}

export interface Chunk {
  id: string;
  document_id: string;
  page?: number | null;
  chunk_index: number;
  text: string;
}

export interface ChatSource {
  document_id?: string;
  page?: number;
  chunk_index?: number;
  snippet?: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sources?: ChatSource[];
}

export interface User {
  username: string;
  role: "ADMIN" | "USER";
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  username: string;
  role: "ADMIN" | "USER";
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  last_message?: string;
}

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

