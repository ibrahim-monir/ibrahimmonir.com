'use client';
import { useEffect, useState } from "react";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { fetchSettings, str } from "@/lib/settings";
import WhatsappIcon from "@/components/WhatsappIcon";

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const baseContactInfo = [
  { Icon: Mail, label: "Email", value: "ibrahimkhalilmp@gmail.com", href: "mailto:ibrahimkhalilmp@gmail.com" },
  { Icon: MapPin, label: "Location", value: "Bangladesh (Remote Worldwide)", href: null },
  { Icon: MessageCircle, label: "Response Time", value: "Within 24 hours", href: null },
];

const socials = [
  { Icon: GithubIcon, label: "GitHub", href: "https://github.com/ibrahimmonir" },
  { Icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com/in/ibrahimmonir" },
  { Icon: XIcon, label: "Twitter / X", href: "https://twitter.com/ibrahimmonir" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");

  // Pre-fill the subject when arriving from a "Get Started" link on the Pricing page.
  useEffect(() => {
    const pkg = new URLSearchParams(window.location.search).get("package");
    if (pkg) {
      setForm((prev) => ({ ...prev, subject: `Pricing Inquiry — ${pkg}` }));
    }
  }, []);

  useEffect(() => {
    fetchSettings().then((s) => setWhatsapp(str(s.contact_whatsapp)));
  }, []);

  const contactInfo = whatsapp
    ? [
        ...baseContactInfo,
        { Icon: WhatsappIcon, label: "WhatsApp", value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, "")}` },
      ]
    : baseContactInfo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! I'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <span className="badge mb-4 inline-flex">Contact</span>
          <h1 className="section-title mb-4">Let&apos;s Work Together</h1>
          <p className="section-subtitle mx-auto">
            Have a project in mind? Let&apos;s discuss how I can help you build it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
            <div className="space-y-6 mb-10">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(249,115,22,0.15)" }}>
                    <c.Icon size={20} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>{c.label}</div>
                    {c.href ? (
                      <a href={c.href}
                        {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="hover:text-orange-400 transition-colors">{c.value}</a>
                    ) : (
                      <span>{c.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-sm font-medium mb-4" style={{ color: "var(--text-muted)" }}>Follow Me</div>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                    style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                    aria-label={s.label}>
                    <s.Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { key: "name", label: "Your Name", type: "text", required: true },
                  { key: "email", label: "Email Address", type: "email", required: true },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                    <input type={f.type} required={f.required}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors focus:border-orange-500"
                      style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone (optional)</label>
                <input type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors focus:border-orange-500"
                  style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject</label>
                <input type="text" required
                  value={form.subject}
                  onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors focus:border-orange-500"
                  style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea required rows={5}
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none focus:border-orange-500"
                  style={{ background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? "Sending..." : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
