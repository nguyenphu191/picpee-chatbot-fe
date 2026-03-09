import { UploadForm } from "@/components/documents/UploadForm";
import { AdminGuard } from "@/components/auth/AdminGuard";

export default function UploadDocumentPage() {
  return (
    <AdminGuard>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Upload tài liệu PDF</h1>
        <UploadForm />
      </div>
    </AdminGuard>
  );
}

