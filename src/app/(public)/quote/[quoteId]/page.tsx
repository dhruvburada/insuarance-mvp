import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Download, CreditCard, Clock, FileText, CheckCircle2 } from "lucide-react";
import { syncPaymentStatusAction } from "@/server/actions/payment-actions";

export const dynamic = "force-dynamic";

interface QuotePageProps {
  params: { quoteId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function QuotePage({
  params,
  searchParams,
}: QuotePageProps) {
  const supabase = createClient();

  // First fetch application
  let { data: applicationData, error } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      premium_amount,
      coverage_amount,
      created_at,
      activated_at,
      client:clients(first_name, last_name, email, phone, city),
      product:insurance_products(name, code, category, provider_name, description, features),
      payments(id, payment_link_url, status, razorpay_payment_id, paid_at, razorpay_payment_link_id)
    `)
    .eq("id", params.quoteId)
    .single();

  if (error || !applicationData) {
    notFound();
  }

  let application = applicationData as any;
  let payment = application.payments?.[0];

  // If payment is pending on page load or returning from callback, check live Razorpay status
  if (application.status !== "active" && payment?.razorpay_payment_link_id) {
    const syncRes = await syncPaymentStatusAction(params.quoteId);
    if (syncRes.success && syncRes.status === "paid") {
      // Re-fetch updated application state
      const { data: updatedData } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          premium_amount,
          coverage_amount,
          created_at,
          activated_at,
          client:clients(first_name, last_name, email, phone, city),
          product:insurance_products(name, code, category, provider_name, description, features),
          payments(id, payment_link_url, status, razorpay_payment_id, paid_at, razorpay_payment_link_id)
        `)
        .eq("id", params.quoteId)
        .single();

      if (updatedData) {
        application = updatedData as any;
        payment = application.payments?.[0];
      }
    }
  }

  const client = application.client;
  const product = application.product;
  const features = (product?.features as string[]) || [];
  const isPaid = application.status === "active" || payment?.status === "paid";

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center antialiased">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl border-2 border-pine-950 overflow-hidden">
        {/* HEADER (LUMIIHEALTH SIGNATURE DEEP PINE) */}
        <div className="bg-pine-950 text-white p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-extrabold bg-lime-400 text-pine-950 px-3 py-1 rounded-full">
              {isPaid ? "Active Policy Certificate" : "Personalized Proposal"}
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

        {/* STATUS BANNER */}
        {isPaid ? (
          <div className="bg-emerald-50 border-b border-emerald-200 p-4 px-6 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                <span>✓ Premium Paid & Policy Activated</span>
              </p>
              <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                Ref: {payment?.razorpay_payment_id || "pay_verified"} • Settled via Razorpay
              </p>
            </div>
          </div>
        ) : payment?.payment_link_url ? (
          <div className="bg-amber-50 border-b border-amber-200 p-4 px-6 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-900">
                Payment Pending Activation
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Complete premium payment below to activate instant coverage
              </p>
            </div>
          </div>
        ) : null}

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
                Key Policy Benefits & Inclusions
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
            {!isPaid && payment?.payment_link_url && (
              <Button
                variant="lime"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                asChild
              >
                <a href={payment.payment_link_url} target="_blank" rel="noopener noreferrer">
                  <CreditCard className="h-5 w-5" />
                  Pay Premium ({formatCurrencyINR(Number(application.premium_amount))}) with Razorpay
                </a>
              </Button>
            )}

            <Button
              variant={isPaid ? "lime" : "outline"}
              size={isPaid ? "lg" : "default"}
              className="w-full flex items-center justify-center gap-2"
              asChild
            >
              <a href={`/api/documents/${application.id}`} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                {isPaid ? "Download Official Policy Document (PDF)" : "Download Official Proposal PDF"}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
