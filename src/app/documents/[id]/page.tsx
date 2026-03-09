"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDocument, reindexDocument } from "@/lib/api";
import { AdminGuard } from "@/components/auth/AdminGuard";
import type { Document } from "@/lib/types";

interface PageProps {
  params: { id: string };
}

export default function DocumentDetailPage({ params }: PageProps) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [reindexing, setReindexing] = useState(false);

  useEffect(() => {
    fetchDocument(params.id)
      .then(setDoc)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleReindex = async (e: React.FormEvent) => {
    e.preventDefault();
    setReindexing(true);
    try {
      await reindexDocument(params.id);
      alert("Đã bắt đầu lập lại chỉ mục!");
      // Refresh doc status if needed
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setReindexing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READY": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "PROCESSING": return "text-sky-400 bg-sky-500/10 border-sky-500/20";
      case "ERROR": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  if (loading || !doc) {
    return (
      <AdminGuard>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto py-10 space-y-10">
        <Link
          href="/documents"
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </div>
          Bảng quản lý tài liệu
        </Link>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/20 to-purple-500/20 rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg transform rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-white">{doc.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm font-mono max-w-md truncate">ID: {doc.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-xl font-bold text-white mb-1">{doc.page_count}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Số trang</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <div className="text-xl font-bold text-white mb-1">{doc.chunk_count}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Số Chunk</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center col-span-2">
                <div className="text-sm font-medium text-slate-300 mb-1">Dung lượng ước tính</div>
                <div className="text-lg font-bold text-sky-400">~{doc.chunk_count * 512} ký tự</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href={`/documents/${doc.id}/chunks`}
            className="group relative flex items-center justify-between p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-sky-500/50 transition-all shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><rect width="20" height="11" x="2" y="9" rx="2" /><path d="M20 15h2" /><path d="M2 15h2" /><path d="M12 18v3" /><path d="M17 18v1" /><path d="M7 18v1" /></svg>
              </div>
              <div>
                <div className="text-lg font-bold text-white">Quản lý Chunks</div>
                <div className="text-sm text-slate-400">Xem và sửa nội dung văn bản</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>

          <button
            onClick={handleReindex}
            disabled={reindexing}
            className="w-full text-left group relative flex items-center justify-between p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-purple-500/50 transition-all shadow-xl disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                {reindexing ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>
                )}
              </div>
              <div>
                <div className="text-lg font-bold text-white">Re-index AI</div>
                <div className="text-sm text-slate-400">{reindexing ? "Đang xử lý..." : "Tính toán lại toàn bộ vector"}</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </AdminGuard>
  );
}

