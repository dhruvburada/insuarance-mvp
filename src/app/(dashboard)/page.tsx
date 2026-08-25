import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Clock, CreditCard, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Parallel concurrent queries with Promise.all for fast load time
  const [
    { data: clientsData },
    { data: applicationsData },
    { data: paymentsData },
  ] = await Promise.all([
    supabase.from("clients").select("id").eq("agent_id", user.id),
    supabase.from("applications").select("id, status, premium_amount").eq("agent_id", user.id),
    supabase.from("payments").select("id, amount, status, paid_at").eq("agent_id", user.id),
  ]);

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
      {/* HERO BANNER (LumiiHealth Signature Style) */}
      <div className="bg-pine-950 text-white p-8 sm:p-10 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-pine-900 text-lime-400 px-3 py-1 rounded-full border border-pine-800">
            Agent Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Life & Health insurance that creates <span className="text-lime-400">Security and Wealth.</span>
          </h1>
          <p className="text-sm text-slate-300">
            Onboard clients, evaluate real-time policy matches with deterministic underwriting, and share quotes directly via WhatsApp.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button variant="lime" asChild>
              <Link href="/clients/new" prefetch={true}>
                + Onboard New Client
              </Link>
            </Button>
            <Button variant="outline" className="bg-pine-900 hover:bg-pine-800 border-pine-800 text-white" asChild>
              <Link href="/products" prefetch={true}>
                Browse Insurance Catalog
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* METRIC BENTO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all border-slate-200">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Clients</span>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-3xl font-extrabold text-pine-950 font-mono mt-1">{totalClients}</p>
            <p className="text-[11px] text-slate-500 mt-1">Managed client profiles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Policies</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">{activePolicies}</p>
            <p className="text-[11px] text-slate-500 mt-1">Paid and activated</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending Links</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-3xl font-extrabold text-amber-600 font-mono mt-1">{pendingPayments}</p>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting client payment</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-slate-200">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Collected Premium</span>
            <CreditCard className="h-4 w-4 text-pine-950" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-2xl sm:text-3xl font-extrabold text-pine-950 font-mono mt-1">
              {formatCurrencyINR(totalRevenue)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Total settled premium</p>
          </CardContent>
        </Card>
      </div>

      {/* QUICK SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 flex items-center justify-between hover:border-slate-300 transition-all">
          <div>
            <h3 className="font-extrabold text-pine-950 text-lg">Client Portfolio</h3>
            <p className="text-xs text-slate-500 mt-0.5">Search clients, view matched policies, and generate proposals</p>
          </div>
          <Button variant="default" size="sm" asChild>
            <Link href="/clients" prefetch={true}>
              View Clients <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </Card>

        <Card className="p-6 flex items-center justify-between hover:border-slate-300 transition-all">
          <div>
            <h3 className="font-extrabold text-pine-950 text-lg">Payment Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track Razorpay checkout links and real-time activation logs</p>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/payments" prefetch={true}>
              View Ledger <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
