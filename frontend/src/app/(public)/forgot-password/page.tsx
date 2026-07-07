'use client';
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "rgba(249,115,22,0.15)" }}>
                <Mail size={28} style={{ color: "var(--primary)" }} />
              </div>
              <h2 className="font-semibold text-lg">Check your inbox</h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent.
              </p>
              <Link href="/login" className="btn-primary w-full justify-center py-3 mt-2 inline-flex">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <input
                  type="email" required autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                  style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
                  placeholder="you@example.com"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? "Sending..." : <><ArrowRight size={16} /> Send Reset Link</>}
              </button>
            </form>
          )}

          {!sent && (
            <div className="mt-6 pt-6 border-t text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              Remember your password?{" "}
              <Link href="/login" style={{ color: "var(--primary)" }} className="hover:underline">Sign in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
