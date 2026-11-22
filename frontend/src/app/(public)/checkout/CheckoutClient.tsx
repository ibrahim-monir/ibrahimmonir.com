"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, CheckCircle, Copy, Check, ShieldCheck, Smartphone, Landmark, Loader2, Clock, Mail, KeyRound,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

interface Plan {
  id: number;
  title: string;
  description: string;
  price: string;
  bdt_price: string | null;
  billing_cycle: string;
  features: string[];
}

type Settings = Record<string, unknown>;
type Method = "bkash" | "nagad" | "bank";
type Currency = "BDT" | "USD";

const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: string | null | undefined) => {
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const money = (n: number, c: Currency) =>
  c === "BDT" ? "৳" + Math.round(n).toLocaleString("en-BD") : "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

const METHOD_META: Record<Method, { label: string; color: string; Icon: typeof Smartphone }> = {
  bkash: { label: "bKash", color: "#e2136e", Icon: Smartphone },
  nagad: { label: "Nagad", color: "#f6921e", Icon: Smartphone },
  bank:  { label: "Bank Transfer", color: "#2563eb", Icon: Landmark },
};

const inputCls = "w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors focus:border-[var(--primary)]";
const inputStyle = { background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text)" };

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }).catch(() => {});
      }}
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
      style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
      aria-label={`Copy ${text}`}
    >
      {done ? <Check size={12} /> : <Copy size={12} />} {done ? "Copied" : "Copy"}
    </button>
  );
}

export default function CheckoutClient() {
  const params = useSearchParams();
  const planId = Number(params.get("plan"));
  const wantCurrency: Currency = params.get("currency")?.toLowerCase() === "usd" ? "USD" : "BDT";

  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [loadError, setLoadError] = useState(false);

  const [picked, setMethod] = useState<Method | null>(null);
  const [pickedBankCurrency, setBankCurrency] = useState<Currency>(wantCurrency);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", project_details: "",
    payer_account: "", transaction_id: "", website: "",
  });
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ order_number: string; amount: string; account?: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/pricing`).then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch(`${API}/settings`).then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([p, st]) => {
        setPlans(Array.isArray(p) ? p : []);
        setSettings(st ?? {});
      })
      .catch(() => setLoadError(true));
  }, []);

  const plan = useMemo(() => plans?.find((p) => p.id === planId) ?? null, [plans, planId]);

  const percent = (() => {
    const p = parseInt(s(settings.payment_advance_percent) || "50", 10);
    return p >= 1 && p <= 100 ? p : 50;
  })();

  const methods = useMemo(() => {
    const m: Method[] = [];
    if (s(settings.payment_bkash_number)) m.push("bkash");
    if (s(settings.payment_nagad_number)) m.push("nagad");
    if (s(settings.bank_account_number)) m.push("bank");
    return m;
  }, [settings]);

  const bdt = num(plan?.bdt_price);
  const usd = num(plan?.price);

  // Mobile banking is BDT-only, so it needs a BDT price on the package.
  const usable = methods.filter((m) => (m === "bank" ? bdt > 0 || usd > 0 : bdt > 0));

  // Derived, not stored: fall back to a sensible default until the visitor picks.
  const method: Method | null =
    picked && usable.includes(picked)
      ? picked
      : usable.length
        ? (wantCurrency === "USD" && usable.includes("bank") ? "bank" : usable[0])
        : null;
  const bankCurrency: Currency =
    pickedBankCurrency === "BDT" && !bdt ? "USD" : pickedBankCurrency === "USD" && !usd ? "BDT" : pickedBankCurrency;

  const currency: Currency = method === "bank" ? bankCurrency : "BDT";
  const price = currency === "BDT" ? bdt : usd;
  const advance = currency === "BDT" ? Math.round((price * percent) / 100) : Math.round(price * percent) / 100;
  const remaining = price - advance;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!plan || !method) return;
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pricing_id: plan.id, currency, payment_method: method }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone({ order_number: data.order_number, amount: data.amount, account: data.account });
        trackEvent("purchase_submitted", { package_name: plan.title, method, currency, value: advance });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 422 && data.errors) {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(data.errors as Record<string, string[]>)) flat[k] = v[0];
        setErrors(flat);
      } else if (res.status === 429) {
        setErrors({ _: "Too many attempts. Please wait a minute and try again." });
      } else {
        setErrors({ _: data.message || "Something went wrong. Please try again or contact us." });
      }
    } catch {
      setErrors({ _: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------- states

  if (loadError) {
    return <Notice title="Couldn't load the checkout" body="Please refresh the page, or contact us to place your order." />;
  }
  if (!plans) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin" size={28} style={{ color: "var(--primary)" }} />
      </div>
    );
  }
  if (!plan) {
    return <Notice title="Choose a package first" body="This link doesn't match an active package." cta={{ href: "/pricing", label: "See pricing" }} />;
  }
  if (!bdt && !usd) {
    return <Notice title={`${plan.title} is quoted on request`} body="Tell me about your project and I'll send a custom quote." cta={{ href: `/contact?package=${encodeURIComponent(plan.title)}`, label: "Request a quote" }} />;
  }
  if (!usable.length) {
    return <Notice title="Online payment isn't available yet" body="Please get in touch and I'll share payment details directly." cta={{ href: `/contact?package=${encodeURIComponent(plan.title)}`, label: "Contact me" }} />;
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto text-center card p-10">
        <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)" }}>
          <CheckCircle size={34} style={{ color: "var(--success)" }} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order received!</h1>
        <p className="mb-6" style={{ color: "var(--text-muted)" }}>
          Thanks, {form.name.split(" ")[0]}. Your order number is
        </p>
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl mb-6 font-mono text-lg font-bold"
          style={{ background: "var(--bg-muted)", border: "1px dashed var(--border)" }}>
          {done.order_number} <CopyButton text={done.order_number} />
        </div>
        <div className="text-left space-y-3 text-sm mb-8">
          <p className="flex gap-3"><Clock size={18} className="shrink-0" style={{ color: "var(--primary)" }} />
            <span>I&apos;ll verify your {done.amount} payment, usually within a few hours.</span></p>
          <p className="flex gap-3"><Mail size={18} className="shrink-0" style={{ color: "var(--primary)" }} />
            <span>A receipt is on its way to <strong>{form.email}</strong>, and you&apos;ll get another email once it&apos;s confirmed.</span></p>
        </div>
        {done.account === "created" && (
          <div className="text-left text-sm rounded-xl p-5 mb-8 space-y-2" style={{ background: "var(--bg-muted)" }}>
            <p className="font-semibold flex gap-2 items-center"><KeyRound size={16} style={{ color: "var(--primary)" }} /> Your client portal account is ready</p>
            <p>Login: <strong>{form.email}</strong></p>
            <p>Password: <strong className="font-mono">{form.phone.replace(/\D+/g, "")}</strong> (your phone number, digits only)</p>
            <p style={{ color: "var(--danger)" }}>Please log in and change this password from Profile → Change Password.</p>
          </div>
        )}
        {done.account === "existing" && (
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            This order is linked to your existing portal account. Log in with your current password to track it.
          </p>
        )}
        <div className="flex flex-wrap gap-3 justify-center">
          {done.account && done.account !== "none" && <Link href="/login" className="btn-primary justify-center">Log in to portal</Link>}
          <Link href="/" className="btn-outline justify-center">Back to home</Link>
        </div>
      </div>
    );
  }

  const bkashType = s(settings.payment_bkash_type) || "Personal";
  const nagadType = s(settings.payment_nagad_type) || "Personal";
  const extra = s(settings.payment_instructions);

  // ---------------------------------------------------------------- form

  return (
    <>
      <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={15} /> Back to pricing
      </Link>
      <h1 className="section-title mb-2">Checkout</h1>
      <p className="mb-10" style={{ color: "var(--text-muted)" }}>
        Pay {percent}% now to book your slot. The rest is due on delivery.
      </p>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-6">
          {/* 1. Details */}
          <section className="card p-6 md:p-8">
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><Step n={1} /> Your details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name" error={errors.name}>
                <input required value={form.name} onChange={set("name")} className={inputCls} style={inputStyle} autoComplete="name" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input required type="email" value={form.email} onChange={set("email")} className={inputCls} style={inputStyle} autoComplete="email" />
              </Field>
              <Field label="Phone / WhatsApp" error={errors.phone}>
                <input required type="tel" value={form.phone} onChange={set("phone")} className={inputCls} style={inputStyle} autoComplete="tel" placeholder="01XXXXXXXXX" />
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  New here? We&apos;ll create your client portal account. Login is your email, the first password is this number.
                </p>
              </Field>
              <Field label="Company (optional)" error={errors.company}>
                <input value={form.company} onChange={set("company")} className={inputCls} style={inputStyle} autoComplete="organization" />
              </Field>
            </div>
            <Field label="About your project (optional)" error={errors.project_details} className="mt-5">
              <textarea rows={4} value={form.project_details} onChange={set("project_details")} className={`${inputCls} resize-none`} style={inputStyle}
                placeholder="What do you need built? Any links, deadlines or references help." />
            </Field>
            {/* Honeypot — hidden from people, filled by bots. */}
            <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")}
              className="hidden" aria-hidden="true" />
          </section>

          {/* 2. Pay */}
          <section className="card p-6 md:p-8">
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><Step n={2} /> Pay the advance</h2>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {usable.map((m) => {
                const { label, color, Icon } = METHOD_META[m];
                const active = method === m;
                return (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className="flex flex-col items-center gap-1.5 py-3.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      border: `2px solid ${active ? color : "var(--border)"}`,
                      background: active ? `${color}14` : "transparent",
                      color: active ? color : "var(--text-muted)",
                    }}>
                    <Icon size={20} /> {label}
                  </button>
                );
              })}
            </div>
            {errors.payment_method && <p className="text-sm mb-4" style={{ color: "var(--danger)" }}>{errors.payment_method}</p>}

            {method && method !== "bank" && (() => {
              const number = s(settings[`payment_${method}_number`]);
              const type = method === "bkash" ? bkashType : nagadType;
              const verb = type === "Merchant" ? "Payment" : type === "Agent" ? "Cash Out" : "Send Money";
              return (
                <div className="rounded-xl p-5 space-y-3 text-sm" style={{ background: "var(--bg-muted)" }}>
                  <p>Open your {METHOD_META[method].label} app and choose <strong>{verb}</strong>.</p>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span>{METHOD_META[method].label} number ({type})</span>
                    <span className="flex items-center gap-2 font-mono font-bold text-base">{number} <CopyButton text={number} /></span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Amount</span>
                    <span className="flex items-center gap-2 font-bold text-base" style={{ color: "var(--primary)" }}>
                      {money(advance, "BDT")} <CopyButton text={String(Math.round(advance))} />
                    </span>
                  </div>
                  <p style={{ color: "var(--text-muted)" }}>After paying, copy the <strong>Transaction ID (TrxID)</strong> from the confirmation SMS and paste it below.</p>
                </div>
              );
            })()}

            {method === "bank" && (
              <div className="rounded-xl p-5 space-y-3 text-sm" style={{ background: "var(--bg-muted)" }}>
                {bdt > 0 && usd > 0 && (
                  <div className="flex gap-2 mb-1">
                    {(["BDT", "USD"] as Currency[]).map((c) => (
                      <button key={c} type="button" onClick={() => setBankCurrency(c)}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={bankCurrency === c ? { background: "var(--primary)", color: "#fff" } : { border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                        Pay in {c}
                      </button>
                    ))}
                  </div>
                )}
                {[
                  ["Bank", s(settings.bank_name)],
                  ["Account name", s(settings.bank_account_name)],
                  ["Account number", s(settings.bank_account_number)],
                  ["Branch", s(settings.bank_branch)],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 flex-wrap">
                    <span>{k}</span>
                    <span className="flex items-center gap-2 font-semibold">{v}{k === "Account number" && <CopyButton text={v} />}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3">
                  <span>Amount</span>
                  <span className="font-bold text-base" style={{ color: "var(--primary)" }}>{money(advance, bankCurrency)}</span>
                </div>
                <p style={{ color: "var(--text-muted)" }}>Use the transfer reference / transaction number from your bank receipt below.</p>
              </div>
            )}

            {extra && <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>{extra}</p>}
          </section>

          {/* 3. Confirm */}
          <section className="card p-6 md:p-8">
            <h2 className="font-bold text-lg mb-5 flex items-center gap-2"><Step n={3} /> Confirm your payment</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={method === "bank" ? "Account / sender name (optional)" : `Your ${method ? METHOD_META[method].label : ""} number`} error={errors.payer_account}>
                <input required={method !== "bank"} value={form.payer_account} onChange={set("payer_account")} className={inputCls} style={inputStyle}
                  placeholder={method === "bank" ? "" : "01XXXXXXXXX"} />
              </Field>
              <Field label={method === "bank" ? "Transfer reference" : "Transaction ID (TrxID)"} error={errors.transaction_id}>
                <input required minLength={4} value={form.transaction_id} onChange={set("transaction_id")}
                  className={`${inputCls} font-mono uppercase`} style={inputStyle} placeholder={method === "bank" ? "" : "e.g. BK7XA2M9QZ"} />
              </Field>
            </div>
            <label className="flex items-start gap-3 mt-6 text-sm cursor-pointer">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" required />
              <span style={{ color: "var(--text-muted)" }}>
                I&apos;ve sent {money(advance, currency)} and agree to the <Link href="/terms" className="underline" target="_blank">Terms of Service</Link>.
              </span>
            </label>
            {(errors._ || errors.pricing_id || errors.currency) && (
              <p className="text-sm mt-4" style={{ color: "var(--danger)" }}>{errors._ || errors.pricing_id || errors.currency}</p>
            )}
            <button type="submit" disabled={submitting || !agree} className="btn-primary w-full justify-center py-3 mt-6 disabled:opacity-60">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Place order · {money(advance, currency)}</>}
            </button>
          </section>
        </div>

        {/* Summary */}
        <aside className="card p-6 md:p-7 lg:sticky lg:top-28">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Order summary</div>
          <h3 className="font-bold text-xl mb-1">{plan.title}</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>{plan.description}</p>
          <ul className="space-y-2 mb-6 text-sm">
            {(plan.features ?? []).slice(0, 6).map((f) => (
              <li key={f} className="flex gap-2"><CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: "var(--success)" }} />{f}</li>
            ))}
          </ul>
          <div className="space-y-2.5 text-sm pt-5" style={{ borderTop: "1px solid var(--border)" }}>
            <Row k="Package price" v={money(price, currency)} />
            <Row k={`Advance (${percent}%)`} v={money(advance, currency)} strong />
            {remaining > 0 && <Row k="Due on delivery" v={money(remaining, currency)} muted />}
          </div>
          <p className="flex gap-2 items-start text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            <ShieldCheck size={15} className="shrink-0" style={{ color: "var(--success)" }} />
            Your order is confirmed only after I verify the payment. If anything doesn&apos;t match, I&apos;ll contact you before starting.
          </p>
        </aside>
      </form>
    </>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--primary)" }}>{n}</span>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs mt-1.5" style={{ color: "var(--danger)" }}>{error}</p>}
    </div>
  );
}

function Row({ k, v, strong, muted }: { k: string; v: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-3" style={muted ? { color: "var(--text-muted)" } : undefined}>
      <span>{k}</span>
      <span className={strong ? "font-bold text-lg" : "font-medium"} style={strong ? { color: "var(--primary)" } : undefined}>{v}</span>
    </div>
  );
}

function Notice({ title, body, cta }: { title: string; body: string; cta?: { href: string; label: string } }) {
  return (
    <div className="max-w-lg mx-auto text-center card p-10">
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>{body}</p>
      {cta && <Link href={cta.href} className="btn-primary justify-center">{cta.label}</Link>}
    </div>
  );
}
