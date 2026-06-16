'use client';
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import toast from "react-hot-toast";
import api from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmation,
      });
      toast.success("Password reset! Please log in.");
      router.push("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Reset failed. The link may have expired.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="card p-8 text-center space-y-4">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Invalid reset link. Please request a new one.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-flex justify-center px-6 py-2.5">
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"} required minLength={8}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-colors"
              style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
              placeholder="Min. 8 characters"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              style={{ color: "var(--text-muted)" }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
          <input
            type={showPass ? "text" : "password"} required
            value={confirmation} onChange={(e) => setConfirmation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
            style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          {loading ? "Resetting..." : <><KeyRound size={16} /> Reset Password</>}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <Link href="/login" style={{ color: "var(--primary)" }} className="hover:underline">← Back to Login</Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <BrandLogo fontSize="1.7rem" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enter your new password below.
          </p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
