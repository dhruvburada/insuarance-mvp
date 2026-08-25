import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { Client, InsuranceProduct } from "@/types/product.types";
import Link from "next/link";
import ClientActionsView from "./client-actions-view";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: clientData, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.clientId)
    .eq("agent_id", user.id)
    .single();

  if (clientError || !clientData) {
    notFound();
  }

  const client = clientData as Client;

  const { data: productsData } = await supabase
    .from("insurance_products")
    .select("*")
    .eq("is_active", true);

  const products = (productsData || []) as InsuranceProduct[];

  const { data: applicationsData } = await supabase
    .from("applications")
    .select("*, product:insurance_products(*), payments(*)")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  const applications = (applicationsData || []) as any[];

  const evaluations = products.map((product) => ({
    product,
    result: evaluateEligibility(client, product),
  }));

  const eligiblePolicies = evaluations.filter((e) => e.result.isEligible);
  const ineligiblePolicies = evaluations.filter((e) => !e.result.isEligible);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/clients" className="text-slate-400 hover:text-slate-600 text-sm">
              Clients
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-slate-700">
              {client.first_name} {client.last_name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {client.first_name} {client.last_name}
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            {client.phone} • {client.email} • Age: {new Date().getFullYear() - new Date(client.dob).getFullYear()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-sm">
        <div>
          <span className="text-xs text-slate-500 font-medium uppercase">Annual Income</span>
          <p className="font-semibold text-slate-900 mt-0.5">{formatCurrencyINR(Number(client.annual_income))}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium uppercase">Smoker Status</span>
          <p className="font-semibold text-slate-900 mt-0.5">{client.is_smoker ? "Active Smoker" : "Non-Smoker"}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium uppercase">Occupation</span>
          <p className="font-semibold text-slate-900 mt-0.5">{client.occupation || "Not Specified"}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium uppercase">Location</span>
          <p className="font-semibold text-slate-900 mt-0.5">{client.city || "N/A"}</p>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Active & Generated Quotes</h2>
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{app.product?.name}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      app.status === "active" ? "bg-emerald-100 text-emerald-800" :
                      app.status === "payment_pending" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Coverage: {formatCurrencyINR(Number(app.coverage_amount))} • Premium: {formatCurrencyINR(Number(app.premium_amount))} / yr
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/quote/${app.id}`}
                    target="_blank"
                    className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-md transition-colors"
                  >
                    View Proposal Link ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ClientActionsView
        client={client}
        eligiblePolicies={eligiblePolicies}
        ineligiblePolicies={ineligiblePolicies}
      />
    </div>
  );
}
