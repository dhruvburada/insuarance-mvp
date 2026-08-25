import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { Client, InsuranceProduct } from "@/types/product.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/clients" className="hover:text-pine-950 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Clients
            </Link>
            <span>/</span>
            <span className="text-pine-950 font-bold">
              {client.first_name} {client.last_name}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-pine-950 tracking-tight flex items-center gap-3">
            {client.first_name} {client.last_name}
            <Badge variant="lime">
              {eligiblePolicies.length} Matched Policies
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Contact: {client.phone} • {client.email} • Age: {new Date().getFullYear() - new Date(client.dob).getFullYear()} yrs
          </p>
        </div>
      </div>

      {/* CLIENT SNAPSHOT HIGHLIGHT BAR */}
      <Card className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Annual Income</span>
            <p className="text-xl font-extrabold text-pine-950 font-mono">
              {formatCurrencyINR(Number(client.annual_income))}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Verified Capacity</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Lifestyle Risk</span>
            <p className="text-sm font-bold text-pine-950">
              {client.is_smoker ? "Active Smoker" : "Non-Smoker (Clean)"}
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">Standard terms apply</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Occupation</span>
            <p className="text-sm font-bold text-pine-950 truncate">
              {client.occupation || "General Salaried"}
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">{client.city || "Urban Region"}</span>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Vehicle Details</span>
            <p className="text-sm font-bold text-pine-950">
              {(client.vehicle_details as any)?.make || "Private Vehicle"}
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {(client.vehicle_details as any)?.type === "four_wheeler" ? "Four-Wheeler" : "Two-Wheeler"}
            </span>
          </div>
        </div>
      </Card>

      {/* ACTIVE PROPOSALS / QUOTES STRIP */}
      {applications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-pine-950">Active Generated Quotes ({applications.length})</h2>
          <div className="grid grid-cols-1 gap-3">
            {applications.map((app) => (
              <Card key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-pine-950 text-base">{app.product?.name}</span>
                    <Badge
                      variant={
                        app.status === "active"
                          ? "success"
                          : app.status === "payment_pending"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {app.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Coverage: <strong className="text-pine-950 font-mono">{formatCurrencyINR(Number(app.coverage_amount))}</strong> • Premium: <strong className="text-pine-950 font-mono">{formatCurrencyINR(Number(app.premium_amount))} / yr</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/quote/${app.id}`} target="_blank" rel="noopener noreferrer">
                      View Proposal Link <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* POLICY MATCHING ENGINE VIEW */}
      <ClientActionsView
        client={client}
        eligiblePolicies={eligiblePolicies}
        ineligiblePolicies={ineligiblePolicies}
      />
    </div>
  );
}
