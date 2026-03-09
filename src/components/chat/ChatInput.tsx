"use client";

import { FormEvent, useState } from "react";

export function ChatInput({
  onSend,
  disabled
}: {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled || loading) return;
    const text = value.trim();
    setValue("");
    setLoading(true);
    try {
      await onSend(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-end gap-2 rounded-2xl p-2 transition-all duration-300 ${disabled || loading
          ? "bg-slate-900/50 border border-slate-800"
          : "bg-slate-900/80 border border-slate-700/80 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:border-sky-500/50 focus-within:border-sky-500 focus-within:shadow-[0_4px_30px_rgba(14,165,233,0.15)] focus-within:bg-slate-900 backdrop-blur-md"
        }`}
    >
      <div className="flex-1 px-3 py-2 flex items-center">
        <textarea
          className="w-full bg-transparent outline-none resize-none text-[15px] max-h-32 text-slate-100 placeholder:text-slate-500 custom-scrollbar"
          rows={1}
          placeholder="Bạn cần hỗ trợ gì với trình chỉnh sửa ảnh PicPee?"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Auto resize
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled || loading}
        />
      </div>
      <button
        type="submit"
        className="shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/25 transition-all outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 group"
        disabled={disabled || loading}
        aria-label="Gửi tin nhắn"
      >
        {loading ? (
          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[-1px] translate-y-[-1px] group-hover:translate-x-[1px] group-hover:translate-y-[-2px] transition-transform"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        )}
      </button>
    </form>
  );
}

