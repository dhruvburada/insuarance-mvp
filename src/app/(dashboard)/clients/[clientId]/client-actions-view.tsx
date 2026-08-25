"use client";

import { useState } from "react";
import { Client, InsuranceProduct } from "@/types/product.types";
import { EligibilityEvaluationResult } from "@/types/eligibility.types";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { createQuoteAction } from "@/server/actions/application-actions";
import { createPaymentLinkAction } from "@/server/actions/payment-actions";
import { buildProposalWhatsAppUrl, buildPaymentWhatsAppUrl } from "@/lib/utils/whatsapp";

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
    } catch (err: any) {
      alert(err.message || "Failed to create payment link");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Policy Matching Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          Eligible Insurance Policies ({eligiblePolicies.length})
        </h2>

        {eligiblePolicies.length === 0 ? (
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
            No policies currently match this client profile based on age, income, or health criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligiblePolicies.map(({ product, result }) => (
              <div key={product.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-primary">
                      {product.category}
                    </span>
                    <span className="text-xs text-slate-400">{product.provider_name}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Calculated Premium</span>
                    <p className="text-lg font-extrabold text-slate-900">
                      {formatCurrencyINR(result.calculatedPremium)} <span className="text-xs font-normal text-slate-500">/ yr</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleGenerateQuote(product, result.calculatedPremium)}
                    disabled={loadingId === product.id}
                    className="bg-primary hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                  >
                    {loadingId === product.id ? "Generating..." : "Generate Quote →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ineligible Policies Section */}
      {ineligiblePolicies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-500 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
            Non-Eligible Policies ({ineligiblePolicies.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ineligiblePolicies.map(({ product, result }) => (
              <div key={product.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-400">{product.provider_name}</span>
                </div>
                <h3 className="font-semibold text-slate-700 text-sm mt-2">{product.name}</h3>
                <div className="mt-3 bg-red-50 p-2.5 rounded text-xs text-red-700 space-y-1">
                  <span className="font-semibold">Disqualification Reasons:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {result.disqualificationReasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Quote Action Modal / Drawer */}
      {activeQuote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Quote Generated</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{activeQuote.policyName}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Client: {client.first_name} {client.last_name} • {formatCurrencyINR(activeQuote.amount)} / yr
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={buildProposalWhatsAppUrl(
                  client.phone,
                  client.first_name,
                  activeQuote.policyName,
                  `${window.location.origin}/quote/${activeQuote.id}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
              >
                💬 Share Proposal via WhatsApp
              </a>

              <button
                onClick={() => handleCreatePaymentLink(activeQuote.id, activeQuote.policyName, activeQuote.amount)}
                disabled={loadingId === activeQuote.id}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {loadingId === activeQuote.id ? "Creating Payment Link..." : "💳 Generate Razorpay Payment Link"}
              </button>

              <button
                onClick={() => setActiveQuote(null)}
                className="w-full py-2 text-slate-600 text-xs font-medium hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Link Modal */}
      {paymentLink && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Payment Link Ready</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{paymentLink.policyName}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Amount: {formatCurrencyINR(paymentLink.amount)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono break-all text-slate-700">
              {paymentLink.url}
            </div>

            <div className="space-y-3">
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
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
              >
                💬 Share Payment Link via WhatsApp
              </a>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentLink.url);
                  alert("Payment link copied to clipboard!");
                }}
                className="w-full py-2.5 px-4 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Copy Link
              </button>

              <button
                onClick={() => setPaymentLink(null)}
                className="w-full py-2 text-slate-600 text-xs font-medium hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
