"use client";

import { useEffect, useState } from "react";
import { fetchConversations, deleteConversation } from "@/lib/api";
import type { Conversation } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface ChatSidebarProps {
    currentId?: string;
    onSelect: (id: string) => void;
    onNewChat: () => void;
}

export function ChatSidebar({ currentId, onSelect, onNewChat }: ChatSidebarProps) {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadConversations();
        } else {
            setConversations([]);
        }
    }, [user]);

    const loadConversations = async () => {
        setLoading(true);
        try {
            const data = await fetchConversations();
            setConversations(data);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Xóa cuộc hội thoại này?")) {
            try {
                await deleteConversation(id);
                setConversations((prev) => prev.filter((c) => c.id !== id));
                if (currentId === id) {
                    onNewChat();
                }
            } catch (err) {
                alert("Không thể xóa hội thoại");
            }
        }
    };

    if (!user) return null;

    return (
        <div className="w-64 flex flex-col h-full bg-slate-900/60 border-r border-white/5 backdrop-blur-xl">
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-2 justify-center px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-lg shadow-sky-500/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Chat mới
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
                {loading && conversations.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-500"></div>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-10 px-4">
                        <p className="text-xs text-slate-500 font-medium">Chưa có lịch sử trò chuyện</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv.id)}
                            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${currentId === conv.id
                                    ? "bg-white/10 border-white/10 text-white shadow-xl"
                                    : "hover:bg-white/5 border-transparent text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="text-sm font-bold truncate">{conv.title}</div>
                                <div className="text-[10px] opacity-40 font-mono mt-0.5">
                                    {new Date(conv.created_at).toLocaleDateString("vi-VN")}
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDelete(e, conv.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-400 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
