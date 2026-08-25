import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils/formatters";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: clientsData } = await supabase
    .from("clients")
    .select("id")
    .eq("agent_id", user.id);

  const { data: applicationsData } = await supabase
    .from("applications")
    .select("id, status, premium_amount")
    .eq("agent_id", user.id);

  const { data: paymentsData } = await supabase
    .from("payments")
    .select("id, amount, status, paid_at")
    .eq("agent_id", user.id);

  const clients = (clientsData || []) as any[];
  const applications = (applicationsData || []) as any[];
  const payments = (paymentsData || []) as any[];

  const totalClients = clients.length;
  const activePolicies = applications.filter((a) => a.status === "active").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Agent Overview</h1>
          <p className="text-slate-600 text-sm mt-1">
            Track client onboarding, policy matches, and collected premiums
          </p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors"
        >
          + Add New Client
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Clients</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalClients}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Active Policies</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{activePolicies}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Pending Payments</span>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{pendingPayments}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Collected Premium</span>
          <p className="text-3xl font-extrabold text-primary mt-2">{formatCurrencyINR(totalRevenue)}</p>
        </div>
      </div>
    </div>
  );
}
