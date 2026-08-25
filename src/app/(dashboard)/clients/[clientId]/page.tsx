import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { evaluateEligibility } from "@/lib/eligibility/engine";
import { formatCurrencyINR, formatDate } from "@/lib/utils/formatters";
import { Client, InsuranceProduct } from "@/types/product.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  User,
  Shield,
  HeartPulse,
  Car,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
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

  const medicalHistory = (client.medical_history as Record<string, any>) || {};
  const vehicleDetails = (client.vehicle_details as Record<string, any>) || {};

  const birthDate = new Date(client.dob);
  const clientAge = isNaN(birthDate.getTime())
    ? null
    : new Date().getFullYear() - birthDate.getFullYear();

  return (
    <div className="space-y-8 pb-12">
      {/* TOP BREADCRUMB & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5">
            <Link href="/clients" className="hover:text-pine-950 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Clients
            </Link>
            <span>/</span>
            <span className="text-pine-950 font-bold">
              {client.first_name} {client.last_name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-pine-950 tracking-tight">
              {client.first_name} {client.last_name}
            </h1>
            <Badge variant="lime" className="text-xs px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              {eligiblePolicies.length} Eligible Matche{eligiblePolicies.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1 text-slate-700 font-semibold">
              <Phone className="h-3.5 w-3.5 text-pine-950" /> {client.phone}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <Mail className="h-3.5 w-3.5 text-pine-950" /> {client.email}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-pine-950" /> {client.city || "India"}
            </span>
            {clientAge !== null && (
              <>
                <span>•</span>
                <span className="font-semibold text-pine-950">{clientAge} yrs old</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/clients/${client.id}/edit`}>
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit Dossier
            </Link>
          </Button>
          <Button variant="lime" size="sm" asChild>
            <Link href="/clients/new">
              + Onboard Another Client
            </Link>
          </Button>
        </div>
      </div>

      {/* QUICK HIGHLIGHT SNAPSHOT BAR */}
      <Card className="p-6 border-slate-200 shadow-sm bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Annual Income (INR)
            </span>
            <p className="text-xl font-extrabold text-pine-950 font-mono">
              {formatCurrencyINR(Number(client.annual_income))}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
              Verified Capacity
            </span>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Lifestyle & Tobacco
            </span>
            <p className="text-sm font-bold text-pine-950">
              {client.is_smoker ? "Active Tobacco User" : "Non-Smoker (Standard Tier)"}
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {client.is_smoker ? "Actuarial loading applies" : "Preferred risk profile"}
            </span>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Occupation
            </span>
            <p className="text-sm font-bold text-pine-950 truncate">
              {client.occupation || "Salaried Professional"}
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {client.city || "Urban Metro"}
            </span>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Motor Asset
            </span>
            <p className="text-sm font-bold text-pine-950">
              {vehicleDetails.type === "four_wheeler"
                ? `Four-Wheeler (${vehicleDetails.make || "Car"})`
                : vehicleDetails.type === "two_wheeler"
                ? `Two-Wheeler (${vehicleDetails.make || "Bike"})`
                : "No Vehicle Registered"}
            </p>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {vehicleDetails.year ? `Year ${vehicleDetails.year}` : "Standard terms"}
            </span>
          </div>
        </div>
      </Card>

      {/* MULTI-TAB VIEW FOR DOSSIER & ACTIONS */}
      <Tabs defaultValue="matching" className="space-y-6">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="matching" className="gap-1.5">
            <Sparkles className="h-4 w-4 text-pine-950" />
            <span>Policy Matching ({eligiblePolicies.length})</span>
          </TabsTrigger>
          <TabsTrigger value="dossier" className="gap-1.5">
            <FileText className="h-4 w-4 text-pine-950" />
            <span>Client Dossier</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <CreditCard className="h-4 w-4 text-pine-950" />
            <span>Quotes & Payments ({applications.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: POLICY MATCHING ENGINE & PROPOSALS */}
        <TabsContent value="matching" className="space-y-8 mt-6">
          <ClientActionsView
            client={client}
            eligiblePolicies={eligiblePolicies}
            ineligiblePolicies={ineligiblePolicies}
          />
        </TabsContent>

        {/* TAB 2: FULL CLIENT DOSSIER BREAKDOWN */}
        <TabsContent value="dossier" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. PERSONAL DEMOGRAPHICS */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-extrabold text-pine-950 flex items-center gap-2">
                  <User className="h-4 w-4 text-pine-950" /> Demographics & Identity
                </CardTitle>
                <Badge variant="secondary">Verified KYC</Badge>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Full Legal Name:</span>
                  <span className="font-bold text-pine-950">{client.first_name} {client.last_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date of Birth:</span>
                  <span className="font-mono font-bold text-pine-950">{client.dob} ({clientAge} yrs)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Gender:</span>
                  <span className="capitalize font-bold text-pine-950">{client.gender}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Phone (WhatsApp):</span>
                  <span className="font-mono font-bold text-pine-950">+91 {client.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Email Address:</span>
                  <span className="font-bold text-pine-950">{client.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-pine-950">{client.city || "N/A"}, {client.pincode || ""}</span>
                </div>
              </CardContent>
            </Card>

            {/* 2. FINANCIAL PROFILE */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-extrabold text-pine-950 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-pine-950" /> Financial & Underwriting
                </CardTitle>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Tier 1
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Annual Declared Income:</span>
                  <span className="font-mono font-bold text-pine-950">{formatCurrencyINR(Number(client.annual_income))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Profession / Occupation:</span>
                  <span className="font-bold text-pine-950">{client.occupation || "Salaried"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Smoking / Tobacco Habit:</span>
                  <span className={`font-bold ${client.is_smoker ? "text-amber-700" : "text-emerald-700"}`}>
                    {client.is_smoker ? "Active User" : "Non-Smoker (Clean)"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Max Term Cover Multiplier:</span>
                  <span className="font-mono font-bold text-pine-950">
                    Up to {formatCurrencyINR(Number(client.annual_income) * 20)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 3. MEDICAL HISTORY */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-extrabold text-pine-950 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-pine-950" /> Medical & Health History
                </CardTitle>
                <Badge variant={Object.values(medicalHistory).some(Boolean) ? "warning" : "success"}>
                  {Object.values(medicalHistory).some(Boolean) ? "Conditions Disclosed" : "Clean Health Record"}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Diabetes", val: medicalHistory.diabetes },
                    { label: "Hypertension (BP)", val: medicalHistory.hypertension },
                    { label: "Heart Conditions", val: medicalHistory.heart_disease },
                    { label: "Cancer History", val: medicalHistory.cancer },
                    { label: "Asthma / Respiratory", val: medicalHistory.asthma },
                    { label: "Kidney / Liver", val: medicalHistory.kidney_liver },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        item.val
                          ? "border-rose-300 bg-rose-50 text-rose-800 font-bold"
                          : "border-slate-100 bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.val ? (
                        <span className="flex items-center gap-1 text-rose-700 font-bold">
                          <AlertTriangle className="h-3 w-3" /> Disclosed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> None
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {medicalHistory.notes && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg mt-2">
                    <span className="font-bold text-slate-700 block mb-0.5">Disclosed Underwriting Notes:</span>
                    <p className="text-slate-600 italic">{medicalHistory.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 4. MOTOR / VEHICLE ASSETS */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-extrabold text-pine-950 flex items-center gap-2">
                  <Car className="h-4 w-4 text-pine-950" /> Motor & Vehicle Classification
                </CardTitle>
                <Badge variant="secondary">
                  {vehicleDetails.type ? vehicleDetails.type.replace("_", " ").toUpperCase() : "NONE"}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                {vehicleDetails.type && vehicleDetails.type !== "none" ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Vehicle Type:</span>
                      <span className="font-bold text-pine-950 capitalize">
                        {vehicleDetails.type.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Make & Model:</span>
                      <span className="font-bold text-pine-950">
                        {vehicleDetails.make || "N/A"} {vehicleDetails.model || ""}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Registration Year:</span>
                      <span className="font-mono font-bold text-pine-950">
                        {vehicleDetails.year || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Registration Number:</span>
                      <span className="font-mono font-bold text-pine-950 uppercase">
                        {vehicleDetails.registration_number || "Not Provided"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 py-4 text-center">
                    No motor vehicle registered under this client profile.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="lime" asChild>
              <Link href={`/clients/${client.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Underwriting Dossier
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* TAB 3: PROPOSALS & PAYMENT LEDGER */}
        <TabsContent value="history" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-pine-950">
              Proposals & Payment History ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <Card className="p-8 text-center text-slate-500 text-sm">
              No quotes or proposals have been generated yet for this client.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <Card key={app.id} className="p-5 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-pine-950 text-base">
                        {app.product?.name || "Insurance Plan"}
                      </span>
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

                    <p className="text-xs text-slate-500">
                      Coverage: <strong className="text-pine-950 font-mono">{formatCurrencyINR(Number(app.coverage_amount))}</strong> • Premium: <strong className="text-pine-950 font-mono">{formatCurrencyINR(Number(app.premium_amount))} / yr</strong>
                    </p>

                    <p className="text-[11px] text-slate-400 font-mono">
                      Generated: {formatDate(app.created_at)} {app.activated_at ? `• Activated: ${formatDate(app.activated_at)}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/quote/${app.id}`} target="_blank" rel="noopener noreferrer">
                        View Proposal <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>

                    <Button variant="outline" size="sm" asChild>
                      <a href={`/api/documents/${app.id}`} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-1.5 h-3.5 w-3.5" /> Proposal PDF
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
