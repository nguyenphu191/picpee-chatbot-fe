"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDocument, fetchDocumentChunks } from "@/lib/api";
import { ChunkEditor } from "@/components/documents/ChunkEditor";
import { AdminGuard } from "@/components/auth/AdminGuard";
import type { Document, Chunk } from "@/lib/types";

interface PageProps {
  params: { id: string };
}

export default function DocumentChunksPage({ params }: PageProps) {
  const [doc, setDoc] = useState<Document | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDocument(params.id),
      fetchDocumentChunks(params.id)
    ])
      .then(([d, c]) => {
        setDoc(d);
        setChunks(c);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

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
      <div className="max-w-5xl mx-auto space-y-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              Text Fragments
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Danh sách Chunk</h1>
            <p className="text-slate-400 text-sm">
              Tài liệu: <span className="text-slate-200 font-medium">{doc.name}</span>
            </p>
          </div>

          <Link
            href={`/documents/${doc.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-lg backdrop-blur-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Quay lại chi tiết
          </Link>
        </div>

        {/* Grid of Chunks */}
        <div className="grid grid-cols-1 gap-4">
          {chunks.length > 0 ? (
            chunks.map((chunk) => (
              <ChunkEditor key={chunk.id} chunk={chunk} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </div>
              <p className="text-slate-400">Tài liệu này chưa có dữ liệu chunk.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-6 py-8 border-t border-white/5">
          <div className="text-center">
            <div className="text-2xl font-bold text-white tracking-tight">{chunks.length}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tổng số Chunk</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white tracking-tight">{doc.page_count}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tổng số trang</div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

