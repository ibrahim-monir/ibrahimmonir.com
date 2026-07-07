'use client';
import { useQuery } from "@tanstack/react-query";
import { Receipt, CheckCircle, Clock, AlertCircle, XCircle, DollarSign } from "lucide-react";
import api from "@/lib/api";

interface Invoice {
  id: number;
  invoice_number: string;
  milestone_no?: number | null;
  total_milestones?: number | null;
  amount: number;
  currency?: string;
  status: string;
  due_date: string;
  paid_at?: string;
  notes?: string;
  project?: { title: string };
}

const symbolFor = (currency?: string) => (currency === "BDT" ? "৳" : "$");

function sumByCurrency(list: Invoice[]): Record<string, number> {
  return list.reduce((acc, i) => {
    const c = i.currency ?? "USD";
    acc[c] = (acc[c] ?? 0) + Number(i.amount);
    return acc;
  }, {} as Record<string, number>);
}

function formatSums(sums: Record<string, number>): string {
  const entries = Object.entries(sums);
  if (entries.length === 0) return "$0";
  return entries.map(([c, v]) => `${symbolFor(c)}${v.toLocaleString()}`).join(" + ");
}

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; label: string }> = {
  pending: { icon: Clock, color: "#f59e0b", label: "Pending" },
  paid: { icon: CheckCircle, color: "#10b981", label: "Paid" },
  overdue: { icon: AlertCircle, color: "#f43f5e", label: "Overdue" },
  cancelled: { icon: XCircle, color: "#6b7280", label: "Cancelled" },
};

export default function InvoicesPage() {
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: () => api.get("/invoices").then((r) => r.data.invoices ?? []),
  });

  const totalPaid = sumByCurrency(invoices.filter((i) => i.status === "paid"));
  const totalPending = sumByCurrency(invoices.filter((i) => i.status === "pending"));
  const totalOverdue = sumByCurrency(invoices.filter((i) => i.status === "overdue"));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Invoices</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>View and track your payment history.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Paid", value: totalPaid, color: "#10b981" },
          { label: "Pending", value: totalPending, color: "#f59e0b" },
          { label: "Overdue", value: totalOverdue, color: "#f43f5e" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} style={{ color: s.color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
            <div className="text-xl font-bold">{formatSums(s.value)}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="card p-5 animate-pulse h-20" style={{ opacity: 0.5 }} />)}
        </div>
      ) : invoices.length === 0 ? (
        <div className="card p-16 text-center" style={{ color: "var(--text-muted)" }}>
          <Receipt size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-2">No invoices yet</p>
          <p className="text-sm">Invoices will appear here as your projects progress.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {invoices.map((inv, i) => {
            const sc = statusConfig[inv.status] ?? statusConfig.pending;
            const Icon = sc.icon;
            return (
              <div key={inv.id}
                className="p-5 flex items-center gap-4 transition-colors hover:bg-white/5"
                style={{ borderBottom: i < invoices.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${sc.color}15` }}>
                  <Icon size={20} style={{ color: sc.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-mono text-sm font-semibold">{inv.invoice_number}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${sc.color}20`, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {inv.project?.title ?? "Project"}
                    {inv.milestone_no
                      ? ` · Milestone ${inv.milestone_no}${inv.total_milestones ? ` of ${inv.total_milestones}` : ""}`
                      : ""} · Due {inv.due_date}
                    {inv.paid_at && ` · Paid ${inv.paid_at}`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-lg">{symbolFor(inv.currency)}{Number(inv.amount).toLocaleString()}</div>
                  {inv.notes && (
                    <div className="text-xs mt-0.5 max-w-[180px] truncate" style={{ color: "var(--text-muted)" }}>
                      {inv.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
