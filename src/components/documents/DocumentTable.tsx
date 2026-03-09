"use client";

import Link from "next/link";
import { deleteDocument } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Document } from "@/lib/types";

export function DocumentTable({ documents }: { documents: Document[] }) {
  const { isAdmin } = useAuth();
  if (!documents.length) {
    return (
      <div className="text-sm text-slate-300">
        Chưa có tài liệu nào. Hãy{" "}
        <Link href="/documents/upload" className="underline">
          upload PDF mới
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-800 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900 text-slate-300">
          <tr>
            <th className="px-3 py-2 text-left">Tên</th>
            <th className="px-3 py-2 text-left">Trạng thái</th>
            <th className="px-3 py-2 text-right">Trang</th>
            <th className="px-3 py-2 text-right">Chunk</th>
            {isAdmin && <th className="px-3 py-2 text-right">Thao tác</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="px-3 py-2">{doc.name}</td>
              <td className="px-3 py-2">{doc.status}</td>
              <td className="px-3 py-2 text-right">{doc.page_count}</td>
              <td className="px-3 py-2 text-right">{doc.chunk_count}</td>
              {isAdmin && (
                <td className="px-3 py-2 text-right space-x-2">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="text-sky-400 hover:text-sky-300 text-xs"
                  >
                    Chi tiết
                  </Link>
                  <Link
                    href={`/documents/${doc.id}/chunks`}
                    className="text-slate-300 hover:text-sky-300 text-xs"
                  >
                    Chunks
                  </Link>
                  <button
                    onClick={async () => {
                      if (confirm(`Bạn có chắc muốn xóa vĩnh viễn tài liệu "${doc.name}"? Hành động này sẽ xóa toàn bộ file gốc và các vector liên quan.`)) {
                        try {
                          await deleteDocument(doc.id);
                          window.location.reload();
                        } catch (err: any) {
                          alert("Lỗi: " + err.message);
                        }
                      }
                    }}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

