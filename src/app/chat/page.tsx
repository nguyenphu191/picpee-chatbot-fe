"use client";

import { useState, useEffect } from "react";
import { sendChatMessage, fetchConversationDetail } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage as ChatMessageItem } from "@/components/chat/ChatMessage";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { useAuth } from "@/context/AuthContext";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Load existing conversation
  const handleSelectConversation = async (id: string) => {
    setLoading(true);
    setConversationId(id);
    setError(null);
    try {
      const detail = await fetchConversationDetail(id);
      setMessages(detail.messages);
    } catch (err: any) {
      setError("Không thể tải tin nhắn của cuộc hội thoại này");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(undefined);
    setError(null);
  };

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text
    };
    setMessages((prev) => [...prev, userMessage]);
    setError(null);
    try {
      const assistant = await sendChatMessage(text, { conversationId });
      setMessages((prev) => [...prev, assistant]);
      if (assistant.conversation_id && !conversationId) {
        setConversationId(assistant.conversation_id);
      }
    } catch (err: any) {
      setError(err.message ?? "Có lỗi xảy ra khi gọi chatbot");
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-3xl shadow-2xl">
      {user && (
        <ChatSidebar
          currentId={conversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
        />
      )}

      <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full pt-4 pb-6 px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Trợ lý AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">PicPee</span>
          </h1>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest opacity-60">Smart Image Assistant</p>
        </div>

        <div className="flex-1 border border-white/5 rounded-3xl mb-4 p-5 flex flex-col gap-5 overflow-y-auto bg-slate-900/40 backdrop-blur-md shadow-2xl shadow-sky-900/10 custom-scrollbar relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
            </div>
          ) : messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 transition-all">
              <div className="w-16 h-16 mb-4 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-lg transform rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 12 2.32 12" /><path d="M12 12 21.68 15.32" /><path d="M12 12 18.68 2.32" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bắt đầu trò chuyện</h3>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Hỏi tôi về Xóa nền, Bộ lọc AI, hoặc cách quản lý tài khoản của bạn trên nền tảng PicPee.
              </p>
            </div>
          )}
          {messages.map((m) => (
            <ChatMessageItem key={m.id} message={m} />
          ))}
        </div>

        {error && (
          <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-4 backdrop-blur-sm shadow-xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span className="font-medium">Lỗi: {error}</span>
          </div>
        )}

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

