import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Download, CreditCard } from "lucide-react";

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
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center antialiased">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl border-2 border-pine-950 overflow-hidden">
        {/* HEADER (LUMIIHEALTH SIGNATURE DEEP PINE) */}
        <div className="bg-pine-950 text-white p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-extrabold bg-lime-400 text-pine-950 px-3 py-1 rounded-full">
              Personalized Proposal
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {product?.provider_name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {product?.name || "Insurance Policy"}
          </h1>
          <p className="text-xs text-slate-300">
            Prepared exclusively for: <strong className="text-white">{client?.first_name} {client?.last_name}</strong>
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* COVERAGE & PREMIUM HIGHLIGHT BOX */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Sum Assured (Cover)
              </span>
              <p className="text-xl font-extrabold text-pine-950 font-mono mt-0.5">
                {formatCurrencyINR(Number(application.coverage_amount))}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Annual Premium
              </span>
              <p className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">
                {formatCurrencyINR(Number(application.premium_amount))}
              </p>
            </div>
          </div>

          {/* KEY BENEFITS */}
          {features.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Policy Benefits & Features
              </h2>
              <ul className="space-y-2 text-xs text-slate-700">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            {payment?.payment_link_url && application.status !== "active" && (
              <Button
                variant="lime"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                asChild
              >
                <a href={payment.payment_link_url} target="_blank" rel="noopener noreferrer">
                  <CreditCard className="h-5 w-5" />
                  Pay Premium ({formatCurrencyINR(Number(application.premium_amount))}) via Razorpay
                </a>
              </Button>
            )}

            {application.status === "active" && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                ✓ Policy is Active & Verified Paid
              </div>
            )}

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              asChild
            >
              <a href={`/api/documents/${application.id}`} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" /> Download Official Proposal PDF
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
