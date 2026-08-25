import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-tight">
          Payment Transactions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Live ledger of generated Razorpay payment links, customer settlements, and activation timestamps
        </p>
      </div>

      <Card className="overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-lime-100 text-pine-950 flex items-center justify-center font-bold text-xl border border-lime-300">
              💳
            </div>
            <h3 className="text-lg font-extrabold text-pine-950">No payments recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Generate payment links from client profiles to track client checkout and activation status here.
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
                  <th className="px-6 py-4">Payment Link</th>
                  <th className="px-6 py-4">Paid At</th>
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
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                        {p.paid_at ? formatDate(p.paid_at) : "Pending"}
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
