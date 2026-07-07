'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, LayoutDashboard, FolderOpen, MessageSquare, Receipt } from "lucide-react";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

const perks = [
  { Icon: LayoutDashboard, title: "Track Progress", desc: "See exactly where your project stands, in real time." },
  { Icon: FolderOpen, title: "Access Files", desc: "Download deliverables, assets, and documents anytime." },
  { Icon: MessageSquare, title: "Message Directly", desc: "Skip the email back-and-forth — chat right here." },
  { Icon: Receipt, title: "View Invoices", desc: "Check payment status and download invoices instantly." },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", company: "", phone: "" });
  const [showPass, setShowPass] = useState(false);
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await register(form.name, form.email, form.password, form.password_confirmation, form.company, form.phone);
      toast.success("Account created! Welcome aboard.");
      router.push("/portal");
    } catch (err) {
      const e = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      const msg = e?.response?.data?.errors?.email?.[0] ?? e?.response?.data?.message ?? "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", required = true) => (
    <div key={key}>
      <label className="block text-sm font-medium mb-1.5">{label}{!required && <span className="ml-1 text-xs opacity-60">(optional)</span>}</label>
      <input type={type} required={required}
        value={form[key]} onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
        style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }} />
    </div>
  );

  return (
    <div className="py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Value proposition */}
          <div className="hidden lg:block">
            <span className="badge mb-4 inline-flex">Client Portal</span>
            <h1 className="section-title mb-4">Your project, all in one place</h1>
            <p className="section-subtitle mb-10">
              Create an account to track progress, grab files, message me directly, and stay on top of invoices — no more digging through email threads.
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
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <div className="text-center lg:hidden mb-8">
              <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Register to access the client portal.
              </p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {field("name", "Full Name")}
                  {field("email", "Email Address", "email")}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {field("company", "Company Name", "text", false)}
                  {field("phone", "Phone Number", "tel", false)}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} required minLength={8}
                      value={form.password} onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-colors"
                      style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }}
                      placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                      style={{ color: "var(--text-muted)" }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                  <input type={showPass ? "text" : "password"} required
                    value={form.password_confirmation} onChange={(e) => setForm(prev => ({ ...prev, password_confirmation: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                    style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }} />
                </div>
                <button type="submit" disabled={isLoading}
                  className="btn-primary w-full justify-center py-3 mt-2">
                  {isLoading ? "Creating account..." : <><UserPlus size={16} /> Create Account</>}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "var(--primary)" }} className="hover:underline">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
