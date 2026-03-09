"use client";

import { useEffect, useState } from "react";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { fetchDocuments } from "@/lib/api";
import type { Document } from "@/lib/types";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments()
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminGuard>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold">Danh sách tài liệu</h1>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <DocumentTable documents={documents} />
        )}
      </div>
    </AdminGuard>
  );
}

