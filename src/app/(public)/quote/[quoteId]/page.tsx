import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatCurrencyINR } from "@/lib/utils/formatters";

export const dynamic = "force-dynamic";

export default async function QuotePage({
  params,
}: {
  params: { quoteId: string };
}) {
  const supabase = createClient();

  const { data: applicationData, error } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      premium_amount,
      coverage_amount,
      client:clients(first_name, last_name, email, phone),
      product:insurance_products(name, category, provider_name, description, features),
      payments(payment_link_url, status)
    `)
    .eq("id", params.quoteId)
    .single();

  if (error || !applicationData) {
    notFound();
  }

  const application = applicationData as any;
  const client = application.client;
  const product = application.product;
  const payment = application.payments?.[0];
  const features = (product?.features as string[]) || [];

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="bg-primary text-primary-foreground p-6 sm:p-8">
          <span className="text-xs uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full font-medium">
            Personalized Insurance Proposal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3">
            {product?.name || "Insurance Policy"}
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Provided by {product?.provider_name}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Prepared For
            </h2>
            <p className="text-lg font-semibold text-slate-900 mt-1">
              {client?.first_name} {client?.last_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <span className="text-xs text-slate-500 font-medium">Coverage (Sum Assured)</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {formatCurrencyINR(Number(application.coverage_amount))}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Annual Premium</span>
              <p className="text-xl font-bold text-primary mt-0.5">
                {formatCurrencyINR(Number(application.premium_amount))}
              </p>
            </div>
          </div>

          {features.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Key Policy Features</h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            {payment?.payment_link_url && application.status !== "active" && (
              <a
                href={payment.payment_link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Pay Premium Now ({formatCurrencyINR(Number(application.premium_amount))})
              </a>
            )}
            {application.status === "active" && (
              <div className="w-full text-center bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold py-3 px-6 rounded-lg">
                ✓ Policy is Active & Paid
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
