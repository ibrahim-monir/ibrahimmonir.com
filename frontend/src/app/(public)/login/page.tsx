'use client';
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, LayoutDashboard, FolderOpen, MessageSquare, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

const perks = [
  { Icon: LayoutDashboard, title: "Track Progress", desc: "See exactly where your project stands, in real time." },
  { Icon: FolderOpen, title: "Access Files", desc: "Download deliverables, assets, and documents anytime." },
  { Icon: MessageSquare, title: "Message Directly", desc: "Skip the email back-and-forth — chat right here." },
  { Icon: Receipt, title: "View Invoices", desc: "Check payment status and download invoices instantly." },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/portal");
    } catch {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Value proposition */}
          <div className="hidden lg:block">
            <span className="badge mb-4 inline-flex">Client Portal</span>
            <h1 className="section-title mb-4">Your project, all in one place</h1>
            <p className="section-subtitle mb-10">
              Sign in to track progress, grab files, message me directly, and stay on top of invoices — no more digging through email threads.
            </p>
            <div className="flex flex-col gap-6">
              {perks.map((p) => (
                <div key={p.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(249,115,22,0.12)" }}>
                    <p.Icon size={19} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5">{p.title}</div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:hidden mb-8">
              <h1 className="text-2xl font-bold mb-2">Client Portal Login</h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Access your projects, files, and messages.
              </p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input type="email" required autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                    style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
                    placeholder="you@example.com" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium">Password</label>
                    <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: "var(--primary)" }}>
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} required autoComplete="current-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-colors"
                      style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      style={{ color: "var(--text-muted)" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="btn-primary w-full justify-center py-3 mt-2">
                  {isLoading ? "Logging in..." : <><ArrowRight size={16} /> Sign In</>}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                Don&apos;t have an account?{" "}
                <Link href="/register" style={{ color: "var(--primary)" }} className="hover:underline">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
