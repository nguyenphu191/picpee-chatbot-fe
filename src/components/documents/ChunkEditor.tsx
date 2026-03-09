"use client";

import { useState } from "react";
import { updateChunk } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Chunk } from "@/lib/types";

export function ChunkEditor({ chunk }: { chunk: Chunk }) {
    const { isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(chunk.text);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await updateChunk(chunk.id, text);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || "Lỗi khi cập nhật chunk");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border border-white/5 rounded-xl p-4 bg-slate-900/40 backdrop-blur-sm transition-all hover:border-white/10 group">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                        Trang {chunk.page ?? "-"}
                    </div>
                    <div className="px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Index #{chunk.chunk_index}
                    </div>
                </div>

                {!isEditing ? (
                    isAdmin && (
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={async () => {
                                    if (confirm("Bạn có chắc chắn muốn xóa chunk này? AI sẽ không thể truy cập thông tin này nữa.")) {
                                        setIsLoading(true);
                                        try {
                                            const { deleteChunk } = await import("@/lib/api");
                                            await deleteChunk(chunk.id);
                                            window.location.reload();
                                        } catch (err: any) {
                                            setError(err.message || "Lỗi khi xóa chunk");
                                            setIsLoading(false);
                                        }
                                    }
                                }}
                                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
                                disabled={isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                Xóa
                            </button>
                        </div>
                    )
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="h-3 w-3 rounded-full border border-sky-400/30 border-t-sky-400 animate-spin" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                            )}
                            Lưu
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-2">
                    <textarea
                        className="w-full bg-slate-950/80 border border-sky-500/30 rounded-lg p-3 text-sm text-slate-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all min-h-[120px] custom-scrollbar"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isLoading}
                    />
                    {error && <div className="text-[11px] text-red-400">{error}</div>}
                </div>
            ) : (
                <div className="relative">
                    <pre className="whitespace-pre-wrap text-slate-300 text-[13px] leading-relaxed font-sans">
                        {text}
                    </pre>
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none opacity-50" />
                </div>
            )}
        </div>
    );
}
