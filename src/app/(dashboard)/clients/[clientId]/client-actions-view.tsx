"use client";

import { useState } from "react";
import { Client, InsuranceProduct } from "@/types/product.types";
import { EligibilityEvaluationResult } from "@/types/eligibility.types";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { createQuoteAction } from "@/server/actions/application-actions";
import { createPaymentLinkAction } from "@/server/actions/payment-actions";
import { buildProposalWhatsAppUrl, buildPaymentWhatsAppUrl } from "@/lib/utils/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2, AlertTriangle, ArrowUpRight, MessageSquare, CreditCard, Copy, Check } from "lucide-react";

interface Props {
  client: Client;
  eligiblePolicies: { product: InsuranceProduct; result: EligibilityEvaluationResult }[];
  ineligiblePolicies: { product: InsuranceProduct; result: EligibilityEvaluationResult }[];
}

export default function ClientActionsView({
  client,
  eligiblePolicies,
  ineligiblePolicies,
}: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState<{ id: string; policyName: string; amount: number } | null>(null);
  const [paymentLink, setPaymentLink] = useState<{ url: string; amount: number; policyName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateQuote = async (product: InsuranceProduct, premiumAmount: number) => {
    setLoadingId(product.id);
    try {
      const quote = await createQuoteAction({
        clientId: client.id,
        productId: product.id,
        premiumAmount,
        coverageAmount: Number(product.coverage_amount),
      });

      setActiveQuote({
        id: quote.id,
        policyName: product.name,
        amount: premiumAmount,
      });
    } catch (err: any) {
      alert(err.message || "Failed to generate quote");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreatePaymentLink = async (applicationId: string, policyName: string, amount: number) => {
    setLoadingId(applicationId);
    try {
      const res = await createPaymentLinkAction(applicationId);
      setPaymentLink({
        url: res.paymentLinkUrl,
        amount,
        policyName,
      });
      setActiveQuote(null);
    } catch (err: any) {
      alert(err.message || "Failed to create payment link");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCopyLink = () => {
    if (paymentLink?.url) {
      navigator.clipboard.writeText(paymentLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10">
      {/* ELIGIBLE POLICIES (LUMIIHEALTH BENTO CARDS) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-pine-950 tracking-tight flex items-center gap-2.5">
              <span>Categories Of Insurance</span>
              <Badge variant="lime" className="ml-2">
                {eligiblePolicies.length} Match{eligiblePolicies.length !== 1 ? "es" : ""}
              </Badge>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic underwriting results for {client.first_name} {client.last_name}
            </p>
          </div>
        </div>

        {eligiblePolicies.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-sm">
            No policies currently match this client profile based on age, income, or health criteria.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligiblePolicies.map(({ product, result }, idx) => {
              const isPrimary = idx === 0;
              const features = (product.features as string[]) || [];

              return (
                <div
                  key={product.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all group ${
                    isPrimary
                      ? "bg-pine-950 text-white shadow-xl"
                      : "bg-white border-2 border-slate-200 text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  {/* TOP ROW: CATEGORY + ARROW */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                        isPrimary
                          ? "bg-pine-900 text-lime-400 border border-pine-800"
                          : "bg-slate-100 text-pine-950"
                      }`}
                    >
                      {product.category === "health" ? "🛡️" : product.category === "term" ? "🤲" : "🚗"}
                    </div>

                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-lg shadow-sm ${
                        isPrimary
                          ? "bg-lime-400 text-pine-950"
                          : "border-2 border-slate-200 text-slate-700 group-hover:border-pine-950 group-hover:text-pine-950"
                      }`}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                          isPrimary
                            ? "bg-pine-900/80 text-lime-400 border-pine-800"
                            : "bg-lime-100 text-pine-950 border-lime-300"
                        }`}
                      >
                        100% Eligible
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {product.provider_name}
                      </span>
                    </div>

                    <h3 className={`text-xl font-extrabold tracking-tight ${isPrimary ? "text-white" : "text-pine-950"}`}>
                      {product.name}
                    </h3>
                    <p className={`text-xs line-clamp-2 ${isPrimary ? "text-slate-300" : "text-slate-500"}`}>
                      {product.description}
                    </p>

                    {/* PRICING STRIP */}
                    <div
                      className={`p-3.5 rounded-xl border flex justify-between items-center text-xs ${
                        isPrimary
                          ? "bg-pine-900/70 border-pine-800"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      <span className={isPrimary ? "text-slate-300" : "text-slate-500"}>
                        Calculated Premium:
                      </span>
                      <span
                        className={`font-extrabold font-mono text-base ${
                          isPrimary ? "text-lime-400" : "text-pine-950"
                        }`}
                      >
                        {formatCurrencyINR(result.calculatedPremium)} <span className="text-[10px] font-normal font-sans">/ yr</span>
                      </span>
                    </div>

                    {/* CRITERIA MET */}
                    {features.length > 0 && (
                      <ul className={`space-y-1 text-xs pt-1 ${isPrimary ? "text-slate-300" : "text-slate-600"}`}>
                        {features.slice(0, 2).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <span className="text-emerald-500 font-bold">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className={`mt-6 pt-5 border-t flex gap-2 ${isPrimary ? "border-pine-900" : "border-slate-100"}`}>
                    <Button
                      variant={isPrimary ? "lime" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleGenerateQuote(product, result.calculatedPremium)}
                      disabled={loadingId === product.id}
                    >
                      {loadingId === product.id ? "Generating..." : "Generate Quote"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* INELIGIBLE POLICIES SECTION */}
      {ineligiblePolicies.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-base font-bold text-slate-500 flex items-center gap-2">
            <span>Incompatible Policies ({ineligiblePolicies.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ineligiblePolicies.map(({ product, result }) => (
              <div
                key={product.id}
                className="bg-slate-50/80 rounded-2xl border border-slate-200 p-7 flex flex-col justify-between opacity-80"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Disqualified
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{product.provider_name}</span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-700">{product.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{product.description}</p>
                  </div>

                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 space-y-1 text-xs text-rose-800">
                    <span className="font-bold block">Disqualification Reason:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-rose-700">
                      {result.disqualificationReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200">
                  <Button variant="secondary" size="sm" disabled className="w-full">
                    Incompatible with Client
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GENERATED QUOTE ACTION MODAL (SHADCN DIALOG) */}
      {activeQuote && (
        <Dialog open={true} onOpenChange={() => setActiveQuote(null)}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="lime">Quote Ready to Pitch</Badge>
              </div>
              <DialogTitle className="mt-2">{activeQuote.policyName}</DialogTitle>
              <DialogDescription>
                Client: <strong>{client.first_name} {client.last_name}</strong> • Calculated Premium: <strong className="text-pine-950 font-mono">{formatCurrencyINR(activeQuote.amount)} / yr</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-700 block">Pre-composed WhatsApp Proposal:</span>
              <p className="font-mono text-[11px] text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                Hello {client.first_name},<br /><br />
                I have prepared your personalized insurance proposal for <strong>{activeQuote.policyName}</strong>.<br /><br />
                📄 View full proposal & coverage details here: {window.location.origin}/quote/{activeQuote.id}
              </p>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button
                variant="whatsapp"
                className="w-full flex items-center justify-center gap-2"
                asChild
              >
                <a
                  href={buildProposalWhatsAppUrl(
                    client.phone,
                    client.first_name,
                    activeQuote.policyName,
                    `${window.location.origin}/quote/${activeQuote.id}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="h-4 w-4" /> Share Proposal via WhatsApp
                </a>
              </Button>

              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleCreatePaymentLink(activeQuote.id, activeQuote.policyName, activeQuote.amount)}
                disabled={loadingId === activeQuote.id}
              >
                <CreditCard className="h-4 w-4" />
                {loadingId === activeQuote.id ? "Creating Link..." : "Generate Razorpay Payment Link"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* PAYMENT LINK MODAL (SHADCN DIALOG) */}
      {paymentLink && (
        <Dialog open={true} onOpenChange={() => setPaymentLink(null)}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="success">Payment Link Ready</Badge>
              </div>
              <DialogTitle className="mt-2">{paymentLink.policyName}</DialogTitle>
              <DialogDescription>
                Amount Due: <strong className="text-pine-950 font-mono">{formatCurrencyINR(paymentLink.amount)}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono break-all text-slate-800 flex items-center justify-between gap-2">
              <span className="truncate">{paymentLink.url}</span>
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>

            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button
                variant="whatsapp"
                className="w-full flex items-center justify-center gap-2"
                asChild
              >
                <a
                  href={buildPaymentWhatsAppUrl(
                    client.phone,
                    client.first_name,
                    paymentLink.policyName,
                    paymentLink.amount,
                    paymentLink.url
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="h-4 w-4" /> Share Payment Link via WhatsApp
                </a>
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setPaymentLink(null)}
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
