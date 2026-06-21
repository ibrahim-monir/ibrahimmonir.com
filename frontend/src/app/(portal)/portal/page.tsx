'use client';
import { useQuery } from "@tanstack/react-query";
import {
  FolderOpen, Receipt, AlertCircle, TrendingUp,
  MessageCircle, FileDown, Clock, CheckCircle,
  ArrowRight, DollarSign, Activity, Zap,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Project {
  id: number; title: string; status: string; progress: number;
  end_date?: string; created_at: string; updated_at: string;
  service?: { title: string };
}
interface Invoice {
  id: number; invoice_number: string; amount: number;
  status: string; due_date: string; created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b", in_progress: "#f97316", review: "#22d3ee",
  completed: "#10b981", cancelled: "#6b7280",
};
const INV_COLOR: Record<string, string> = {
  pending: "#f59e0b", paid: "#10b981", overdue: "#f43f5e", cancelled: "#6b7280",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

/* ---------- Skeleton ---------- */
function Skeleton({ h = "h-4", w = "w-full", rounded = "rounded" }: { h?: string; w?: string; rounded?: string }) {
  return <div className={`${h} ${w} ${rounded} animate-pulse`} style={{ background: "var(--bg-muted)" }} />;
}
function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton h="h-10" w="w-10" rounded="rounded-lg" />
      <Skeleton h="h-7" w="w-16" />
      <Skeleton h="h-3" w="w-24" />
    </div>
  );
}

/* ---------- Donut chart ---------- */
function DonutChart({ percent, color }: { percent: number; color: string }) {
  const r = 28; const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" strokeWidth="8" stroke="var(--bg-muted)" />
      <circle cx="36" cy="36" r={r} fill="none" strokeWidth="8" stroke={color}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)">{percent}%</text>
    </svg>
  );
}

/* ---------- Main ---------- */
export default function PortalDashboard() {
  const { user } = useAuthStore();

  const { data: projects = [], isLoading: projLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => api.get("/projects").then((r) => r.data.projects ?? []),
  });
  const { data: invoices = [], isLoading: invLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: () => api.get("/invoices").then((r) => r.data.invoices ?? []),
  });
  const { data: unreadDM = 0 } = useQuery<number>({
    queryKey: ["dm-unread"],
    queryFn: () => api.get("/dm/unread").then((r) => r.data.count),
    refetchInterval: 10000,
  });

  const loading = projLoading || invLoading;

  /* derived stats */
  const activeProjects   = projects.filter((p) => p.status === "in_progress").length;
  const overdueInvoices  = invoices.filter((i) => i.status === "overdue");
  const pendingAmt       = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + +i.amount, 0);
  const paidAmt          = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + +i.amount, 0);
  const avgProgress      = projects.length
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  /* activity feed: merge projects + invoices sorted by updated_at desc */
  type ActivityItem = { id: string; label: string; sub: string; color: string; icon: string; time: string };
  const activity: ActivityItem[] = [
    ...projects.slice(0, 5).map((p) => ({
      id: `p${p.id}`, label: p.title, sub: p.status.replace("_", " "),
      color: STATUS_COLOR[p.status] ?? "#6b7280", icon: "project", time: p.updated_at,
    })),
    ...invoices.slice(0, 5).map((i) => ({
      id: `i${i.id}`, label: i.invoice_number, sub: `${formatCurrency(+i.amount)} · ${i.status}`,
      color: INV_COLOR[i.status] ?? "#6b7280", icon: "invoice", time: i.created_at,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  /* upcoming deadlines */
  const upcoming = projects
    .filter((p) => p.end_date && p.status !== "completed" && p.status !== "cancelled")
    .map((p) => ({ ...p, days: daysUntil(p.end_date!) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-7">

      {/* ── Overdue alert ── */}
      {overdueInvoices.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", color: "#f43f5e" }}>
          <AlertCircle size={18} className="shrink-0" />
          <span>
            You have <strong>{overdueInvoices.length}</strong> overdue invoice{overdueInvoices.length > 1 ? "s" : ""} —&nbsp;
            total <strong>{formatCurrency(overdueInvoices.reduce((s, i) => s + +i.amount, 0))}</strong>.
          </span>
          <Link href="/portal/invoices" className="ml-auto shrink-0 underline">View</Link>
        </div>
      )}

      {/* ── Greeting ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {greeting()}, {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Here&apos;s an overview of your projects and activity.
          </p>
        </div>
        {unreadDM > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", color: "var(--primary)" }}>
            <MessageCircle size={16} />
            {unreadDM} unread message{unreadDM > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Stat cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Projects",    value: projects.length,       icon: FolderOpen,  color: "#f97316", href: "/portal/projects" },
            { label: "Active Projects",   value: activeProjects,        icon: TrendingUp,  color: "#fb923c", href: "/portal/projects" },
            { label: "Pending Payment",   value: formatCurrency(pendingAmt), icon: Receipt, color: "#f59e0b", href: "/portal/invoices" },
            { label: "Total Paid",        value: formatCurrency(paidAmt),    icon: CheckCircle, color: "#10b981", href: "/portal/invoices" },
          ].map((s) => (
            <Link key={s.label} href={s.href}
              className="card p-5 hover:border-orange-500/50 transition-all group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${s.color}20` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div className="text-xl font-bold mb-1 group-hover:text-orange-400 transition-colors">{s.value}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Quick actions ── */}
      <div>
        <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
          <Zap size={16} style={{ color: "var(--primary)" }} /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Send a Message", icon: MessageCircle, href: "/portal/messages", color: "#f97316" },
            { label: "View Invoices",  icon: Receipt,       href: "/portal/invoices", color: "#f59e0b" },
            { label: "My Files",       icon: FileDown,      href: "/portal/files",    color: "#22d3ee" },
            { label: "My Projects",    icon: FolderOpen,    href: "/portal/projects", color: "#10b981" },
          ].map((a) => (
            <Link key={a.label} href={a.href}
              className="card p-4 flex items-center gap-3 hover:border-orange-500/50 transition-all group text-sm font-medium">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${a.color}18` }}>
                <a.icon size={16} style={{ color: a.color }} />
              </div>
              <span className="truncate">{a.label}</span>
              <ArrowRight size={14} className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-muted)" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Middle row: Projects + Donut + Deadlines ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent projects (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base">Recent Projects</h2>
            <Link href="/portal/projects" className="text-sm" style={{ color: "var(--primary)" }}>View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="card p-5 space-y-3">
                  <Skeleton h="h-4" w="w-2/3" />
                  <Skeleton h="h-2" />
                  <Skeleton h="h-3" w="w-1/3" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="card p-12 text-center space-y-4">
              <FolderOpen size={40} className="mx-auto opacity-30" style={{ color: "var(--text-muted)" }} />
              <div>
                <p className="font-medium mb-1" style={{ color: "var(--text-muted)" }}>No projects yet</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Get in touch to kick off your first project.
                </p>
              </div>
              <Link href="/portal/messages"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "var(--primary)", color: "#fff" }}>
                <MessageCircle size={15} /> Contact Us
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/portal/projects/${p.id}`}
                  className="card p-4 flex items-center gap-4 hover:border-orange-500/50 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium mb-1 truncate text-sm">{p.title}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--bg-muted)" }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${p.progress}%`, background: STATUS_COLOR[p.status] ?? "var(--primary)" }} />
                      </div>
                      <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{p.progress}%</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: `${STATUS_COLOR[p.status]}20`, color: STATUS_COLOR[p.status] }}>
                    {p.status.replace("_", " ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column: donut + deadlines */}
        <div className="space-y-4">

          {/* Overall progress donut */}
          <div className="card p-5 flex flex-col items-center text-center">
            <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>OVERALL PROGRESS</p>
            {loading ? (
              <Skeleton h="h-18" w="w-18" rounded="rounded-full" />
            ) : (
              <DonutChart percent={avgProgress} color="var(--primary)" />
            )}
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              Across {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Upcoming deadlines */}
          <div className="card p-5">
            <p className="text-xs font-semibold mb-3 flex items-center gap-1.5"
              style={{ color: "var(--text-muted)" }}>
              <Clock size={13} /> UPCOMING DEADLINES
            </p>
            {loading ? (
              <div className="space-y-2">{[1,2].map((i) => <Skeleton key={i} h="h-8" />)}</div>
            ) : upcoming.length === 0 ? (
              <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>No upcoming deadlines</p>
            ) : (
              <div className="space-y-2.5">
                {upcoming.map((p) => (
                  <Link key={p.id} href={`/portal/projects/${p.id}`}
                    className="flex items-center justify-between gap-2 group">
                    <span className="text-xs truncate group-hover:underline">{p.title}</span>
                    <span className="text-xs font-semibold shrink-0 px-2 py-0.5 rounded-full"
                      style={{
                        background: p.days < 0 ? "rgba(244,63,94,0.15)" : p.days <= 3 ? "rgba(245,158,11,0.15)" : "rgba(249,115,22,0.12)",
                        color: p.days < 0 ? "#f43f5e" : p.days <= 3 ? "#f59e0b" : "var(--primary)",
                      }}>
                      {p.days < 0 ? `${Math.abs(p.days)}d overdue` : p.days === 0 ? "Today" : `${p.days}d left`}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent activity feed ── */}
      {activity.length > 0 && (
        <div>
          <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
            <Activity size={16} style={{ color: "var(--primary)" }} /> Recent Activity
          </h2>
          <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
            {activity.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5"
                style={{ borderColor: "var(--border)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${a.color}18` }}>
                  {a.icon === "project"
                    ? <FolderOpen size={14} style={{ color: a.color }} />
                    : <Receipt size={14} style={{ color: a.color }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.label}</div>
                  <div className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{a.sub}</div>
                </div>
                <div className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                  {new Date(a.time).toLocaleDateString([], { month: "short", day: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Financial summary ── */}
      {invoices.length > 0 && (
        <div>
          <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
            <DollarSign size={16} style={{ color: "var(--primary)" }} /> Financial Summary
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Paid",    value: paidAmt,                                               color: "#10b981" },
              { label: "Pending",       value: pendingAmt,                                            color: "#f59e0b" },
              { label: "Overdue",       value: overdueInvoices.reduce((s, i) => s + +i.amount, 0),   color: "#f43f5e" },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                </div>
                <div className="text-xl font-bold" style={{ color: s.value > 0 && s.label !== "Total Paid" ? s.color : "var(--text)" }}>
                  {formatCurrency(s.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
