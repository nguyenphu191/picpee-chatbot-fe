"use client";

import type { ChatMessage as ChatMessageType } from "@/lib/types";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>

        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser
          ? "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/20"
          : "bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/20"
          }`}>
          {isUser ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`group flex flex-col gap-2 rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed relative ${isUser
            ? "bg-white text-slate-900 rounded-tr-sm shadow-xl shadow-black/5"
            : "bg-slate-800/80 text-slate-100 rounded-tl-sm border border-slate-700/50 backdrop-blur-sm shadow-lg shadow-black/10"
            }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>

          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-2 border-t border-slate-700/60 pt-3 flex flex-col gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                Nguồn tham khảo
              </div>
              <ul className="space-y-1.5 mt-0.5">
                {message.sources.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300 bg-slate-900/40 p-1.5 rounded-md border border-white/5">
                    <span className="shrink-0 mt-0.5 text-slate-500">•</span>
                    <span className="line-clamp-2 leading-snug">
                      {s.snippet ? `"${s.snippet}..."` : s.document_id}
                      <span className="text-slate-500 ml-1 block mt-0.5">
                        {typeof s.page === "number" && `(Trang ${s.page})`}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

