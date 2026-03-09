"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const links = [
    { href: "/chat", label: "Chatbot AI", public: true },
    { href: "/documents", label: "Tài liệu", public: false },
    { href: "/documents/upload", label: "Upload PDF", public: false }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-shadow">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-lg group-hover:text-white transition-colors">
            PicPee <span className="text-sky-400 font-medium">BETA</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-1 md:gap-2">
            {links.map((link) => {
              // Hide admin links if not admin
              if (!link.public && !isAdmin) return null;

              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active
                    ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-white leading-none">{user.username}</span>
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-tighter">{user.role}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
                title="Đăng xuất"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98]"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

