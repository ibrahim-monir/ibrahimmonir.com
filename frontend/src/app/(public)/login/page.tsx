'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <BrandLogo fontSize="1.7rem" />
          </Link>
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

        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
