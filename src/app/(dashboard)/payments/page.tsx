import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, CreditCard, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fast single query from database
  const { data: paymentsData } = await supabase
    .from("payments")
    .select(`
      *,
      client:clients(first_name, last_name, email, phone),
      application:applications(id, product:insurance_products(name))
    `)
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false });

  const payments = (paymentsData || []) as any[];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-tight flex items-center gap-2.5">
            Payment Transactions & Settlements
            <Badge variant="lime" className="text-xs px-2.5 py-0.5">
              Razorpay Connected
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live ledger of generated Razorpay payment links, settlements, and automated policy activations
          </p>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href="/clients" prefetch={true}>
            View Clients <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        {payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-lime-100 text-pine-950 flex items-center justify-center border border-lime-300">
              <CreditCard className="h-6 w-6 text-pine-950" />
            </div>
            <h3 className="text-lg font-extrabold text-pine-950">No payments recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Generate payment links from matched policies in client profiles to track online payments and instant policy activations here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Policy</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Hosted Checkout URL</th>
                  <th className="px-6 py-4">Payment Ref / Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => {
                  const client = p.client;
                  const app = p.application;
                  const product = app?.product;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-pine-950">
                        {client?.first_name} {client?.last_name}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {product?.name || "Insurance Policy"}
                      </td>
                      <td className="px-6 py-4 font-bold font-mono text-pine-950">
                        {formatCurrencyINR(Number(p.amount))}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            p.status === "paid"
                              ? "success"
                              : p.status === "failed"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {p.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={p.payment_link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-pine-950 font-semibold hover:underline font-mono truncate max-w-xs block flex items-center gap-1"
                        >
                          <span className="truncate">{p.payment_link_url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono">
                        {p.status === "paid" ? (
                          <div>
                            <span className="text-emerald-700 font-bold block">{p.razorpay_payment_id || "pay_verified"}</span>
                            <span className="text-slate-400 text-[11px]">{p.paid_at ? formatDate(p.paid_at) : "Settled"}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Pending Payment</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
