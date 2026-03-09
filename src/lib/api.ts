import type { AuthResponse, ChatMessage, Chunk, Conversation, ConversationDetail, Document, User } from "./types";

const getBackendUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    // Fallback cho phát triển local nếu quên set env
    if (typeof window === "undefined") return "http://localhost:8000";
    throw new Error("NEXT_PUBLIC_BACKEND_URL chưa được cấu hình");
  }
  return url.replace(/\/+$/, "");
};

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`
  };
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${getBackendUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
  return handleResponse<AuthResponse>(res);
}

export async function fetchDocuments(): Promise<Document[]> {
  const res = await fetch(`${getBackendUrl()}/documents`, {
    headers: getAuthHeaders(),
    next: { revalidate: 0 }
  });
  const data = await handleResponse<{ items: Document[] }>(res);
  return data.items;
}

export async function fetchDocument(id: string): Promise<Document> {
  const res = await fetch(`${getBackendUrl()}/documents/${id}`, {
    headers: getAuthHeaders(),
    next: { revalidate: 0 }
  });
  return handleResponse<Document>(res);
}

export async function fetchDocumentChunks(id: string): Promise<Chunk[]> {
  const res = await fetch(`${getBackendUrl()}/documents/${id}/chunks`, {
    headers: getAuthHeaders(),
    next: { revalidate: 0 }
  });
  return handleResponse<Chunk[]>(res);
}

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${getBackendUrl()}/documents/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData
  });
  return handleResponse<Document>(res);
}

export async function reindexDocument(id: string): Promise<Document> {
  const res = await fetch(`${getBackendUrl()}/documents/${id}/reindex`, {
    method: "POST",
    headers: getAuthHeaders()
  });
  return handleResponse<Document>(res);
}

export async function sendChatMessage(
  question: string,
  options?: { documentIds?: string[]; language?: string; conversationId?: string }
): Promise<ChatMessage & { conversation_id?: string }> {
  const res = await fetch(`${getBackendUrl()}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      question,
      document_ids: options?.documentIds,
      language: options?.language ?? "en",
      conversation_id: options?.conversationId
    })
  });

  const data = await handleResponse<{
    answer: string;
    sources: ChatMessage["sources"];
    conversation_id?: string;
  }>(res);

  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: data.answer,
    sources: data.sources,
    conversation_id: data.conversation_id
  };
}

export async function updateChunk(
  chunkId: string,
  text: string
): Promise<Chunk> {
  const res = await fetch(`${getBackendUrl()}/documents/chunks/${chunkId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({ text })
  });
  return handleResponse<Chunk>(res);
}

export async function deleteDocument(id: string): Promise<{ message: string }> {
  const res = await fetch(`${getBackendUrl()}/documents/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return handleResponse<{ message: string }>(res);
}

export async function deleteChunk(id: string): Promise<{ message: string }> {
  const res = await fetch(`${getBackendUrl()}/documents/chunks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return handleResponse<{ message: string }>(res);
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch(`${getBackendUrl()}/history`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Conversation[]>(res);
}

export async function fetchConversationDetail(id: string): Promise<ConversationDetail> {
  const res = await fetch(`${getBackendUrl()}/history/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<ConversationDetail>(res);
}

export async function deleteConversation(id: string): Promise<{ message: string }> {
  const res = await fetch(`${getBackendUrl()}/history/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return handleResponse<{ message: string }>(res);
}

