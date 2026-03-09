import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "PicPee AI Chatbot",
  description: "Chatbot AI RAG siêu việt cho trang web chỉnh sửa ảnh PicPee"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30`}>
        <AuthProvider>
          {/* Premium Background Gradients */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(2,6,23,1))]"></div>
          <div className="fixed inset-0 z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

          <Navbar />
          <Container>{children}</Container>
        </AuthProvider>
      </body>
    </html>
  );
}

