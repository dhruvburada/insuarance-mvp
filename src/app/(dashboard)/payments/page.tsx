import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";

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
        <h1 className="text-2xl font-bold text-slate-900">Payment Transactions</h1>
        <p className="text-slate-600 text-sm mt-1">
          Live ledger of generated Razorpay payment links, customer payments, and activation timestamps
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">💳</span>
            <h3 className="text-lg font-semibold text-slate-900 mt-3">No payments recorded yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Generate payment links from client profiles to track client checkout and activation status here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Client</th>
                  <th className="px-6 py-3.5">Policy</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Payment Link</th>
                  <th className="px-6 py-3.5">Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => {
                  const client = p.client;
                  const app = p.application;
                  const product = app?.product;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {client?.first_name} {client?.last_name}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {product?.name || "Insurance Policy"}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {formatCurrencyINR(Number(p.amount))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            p.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : p.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={p.payment_link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline font-mono truncate max-w-xs block"
                        >
                          {p.payment_link_url}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {p.paid_at ? formatDate(p.paid_at) : "Pending"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
