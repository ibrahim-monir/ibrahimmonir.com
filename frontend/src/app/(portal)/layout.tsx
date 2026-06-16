'use client';
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, FolderOpen, FileDown, MessageSquare,
  Receipt, LogOut, User, Menu, X
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import BrandLogo from "@/components/BrandLogo";
import { usePresence } from "@/hooks/usePresence";

const navItems = [
  { href: "/portal", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/portal/projects", icon: FolderOpen, label: "Projects" },
  { href: "/portal/files", icon: FileDown, label: "Files" },
  { href: "/portal/messages", icon: MessageSquare, label: "Messages" },
  { href: "/portal/invoices", icon: Receipt, label: "Invoices" },
  { href: "/portal/profile", icon: User, label: "Profile" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, token, logout, fetchUser } = useAuthStore();
  usePresence();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) { router.push("/login"); return; }
    if (!user) fetchUser();
  }, [hydrated, token, user, fetchUser, router]);

  if (!hydrated) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
    </div>
  );

  if (!token) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`flex flex-col h-full ${mobile ? "w-72" : "w-64"}`}
      style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
      <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo fontSize="1.1rem" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/portal" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? "text-white" : "hover:bg-white/5"}`}
              style={active ? { background: "var(--primary)", color: "#fff" } : { color: "var(--text-muted)" }}>
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <Link href="/portal/profile"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all hover:opacity-80"
          style={{ background: "var(--bg-muted)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--primary)" }}>
            <User size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{user?.name ?? "Loading..."}</div>
            <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user?.email}</div>
          </div>
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-all hover:bg-red-500/10"
          style={{ color: "#f87171" }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-4 px-4 h-14 border-b shrink-0"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}>
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm">Client Portal</span>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1.5" style={{ color: "var(--text-muted)" }}>
              <X size={20} />
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
