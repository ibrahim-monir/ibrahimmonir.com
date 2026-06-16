'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

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
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.email?.[0] ?? err?.response?.data?.message ?? "Registration failed. Please try again.";
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <BrandLogo fontSize="1.7rem" />
          </Link>
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

        <p className="text-center mt-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-white transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
