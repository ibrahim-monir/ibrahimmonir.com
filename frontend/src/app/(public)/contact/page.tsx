'use client';
import { useEffect, useState } from "react";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { fetchSettings, str } from "@/lib/settings";
import { fetchSocialLinks, socialMeta, type SocialLink } from "@/lib/socialIcons";
import WhatsappIcon from "@/components/WhatsappIcon";

const baseContactInfo = [
  { Icon: Mail, label: "Email", value: "ibrahimkhalilmp@gmail.com", href: "mailto:ibrahimkhalilmp@gmail.com" },
  { Icon: MapPin, label: "Location", value: "Bangladesh (Remote Worldwide)", href: null },
  { Icon: MessageCircle, label: "Response Time", value: "Within 24 hours", href: null },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [socials, setSocials] = useState<SocialLink[]>([]);

  // Pre-fill the subject when arriving from a "Get Started" link on the Pricing page.
  useEffect(() => {
    const pkg = new URLSearchParams(window.location.search).get("package");
    if (pkg) {
      setForm((prev) => ({ ...prev, subject: `Pricing Inquiry — ${pkg}` }));
    }
  }, []);

  useEffect(() => {
    fetchSettings().then((s) => setWhatsapp(str(s.contact_whatsapp)));
    fetchSocialLinks().then(setSocials);
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

      {/* ── Hero — full-bleed image with centered content overlaid ── */}
      <section className="relative overflow-hidden mb-20" style={{ minHeight: 420 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/contact-hero.jpg" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.6) 55%, rgba(0,0,0,.35) 100%)" }} />

        <div className="relative container flex flex-col items-center justify-center text-center" style={{ minHeight: 420, paddingTop: 60, paddingBottom: 60 }}>
          <div className="max-w-2xl">
            <span className="badge mb-4 inline-flex">Contact</span>
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1rem", color: "#fff" }}>
              Let&apos;s Work Together
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
              Have a project in mind? Let&apos;s discuss how I can help you build it.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
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
                {socials.map((s) => {
                  const { label, Icon } = socialMeta(s.platform);
                  return (
                    <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                      style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                      aria-label={label}>
                      <Icon />
                    </a>
                  );
                })}
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
