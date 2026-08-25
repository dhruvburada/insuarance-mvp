"use client";

import React, { useState, useMemo } from "react";
import { InsuranceProduct } from "@/types/product.types";
import { RuleCriteria } from "@/types/eligibility.types";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Shield,
  HeartPulse,
  Car,
  ArrowUpRight,
  CheckCircle2,
  Search,
  UserPlus,
  SlidersHorizontal,
  Building2,
  Info,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface ProductsViewProps {
  products: InsuranceProduct[];
}

const CARRIER_PARTNERS = [
  { name: "Star Health", tag: "Health Insurance Specialist", logoText: "Star Health" },
  { name: "HDFC Life", tag: "Life & Term Protection", logoText: "HDFC Life" },
  { name: "ICICI Lombard", tag: "Comprehensive Motor & Health", logoText: "ICICI Lombard" },
  { name: "Bajaj Allianz", tag: "General & Auto Protection", logoText: "Bajaj Allianz" },
];

export default function ProductsView({ products }: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [inspectProduct, setInspectProduct] = useState<InsuranceProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.provider_name.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const renderCategoryIcon = (category: string, isPrimary: boolean) => {
    const iconClass = isPrimary ? "h-6 w-6 text-lime-400" : "h-6 w-6 text-pine-950";
    if (category === "health") return <HeartPulse className={iconClass} />;
    if (category === "vehicle") return <Car className={iconClass} />;
    return <Shield className={iconClass} />;
  };

  return (
    <div className="space-y-10 pb-12">
      {/* HERO SECTION WITH SEARCH & CATEGORY FILTER */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5">
              <span className="flex items-center gap-1 text-pine-950 font-bold">
                <Layers className="h-3.5 w-3.5" /> Institutional Master Catalog
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-pine-950 tracking-tight flex items-center gap-3">
              Product Master Catalog
              <Badge variant="lime" className="text-xs px-3 py-1 font-bold">
                {products.length} Active Plan{products.length !== 1 ? "s" : ""}
              </Badge>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Carrier policies pre-configured with deterministic underwriting constraints and sum assured limits
            </p>
          </div>

          <Button variant="lime" asChild>
            <Link href="/clients/new">
              <UserPlus className="mr-2 h-4 w-4" /> Onboard Client
            </Link>
          </Button>
        </div>

        {/* SEARCH BAR & CATEGORY PILLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans, carriers, or codes..."
              className="pl-10 h-11 text-xs sm:text-sm"
            />
          </div>

          {/* CATEGORY SELECTOR BUTTONS */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Categories" },
              { id: "health", label: "Health" },
              { id: "term", label: "Term Life" },
              { id: "vehicle", label: "Motor Vehicle" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-pine-950 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS BENTO GRID */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-extrabold text-pine-950">No insurance products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active policies match your current search criteria. Try adjusting your query or category filters.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => {
            const isFeatured = idx === 0 && selectedCategory === "all";
            const features = (product.features as string[]) || [];
            const rules = (product.eligibility_rules as RuleCriteria) || {};

            return (
              <div
                key={product.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all group ${
                  isFeatured
                    ? "bg-pine-950 text-white shadow-xl"
                    : "bg-white border-2 border-slate-200 text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* TOP ROW: CATEGORY ICON + TOP-RIGHT ARROW PILL */}
                <div className="flex items-start justify-between">
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold ${
                      isFeatured
                        ? "bg-pine-900 border border-pine-800"
                        : "bg-slate-100"
                    }`}
                  >
                    {renderCategoryIcon(product.category, isFeatured)}
                  </div>

                  <button
                    onClick={() => setInspectProduct(product)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-lg shadow-sm transition-transform group-hover:scale-105 ${
                      isFeatured
                        ? "bg-lime-400 text-pine-950"
                        : "border-2 border-slate-200 text-slate-700 group-hover:border-pine-950 group-hover:text-pine-950"
                    }`}
                    title="Inspect Underwriting Specifications"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>

                {/* CARD BODY */}
                <div className="mt-8 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                        isFeatured
                          ? "bg-pine-900/80 text-lime-400 border-pine-800"
                          : "bg-lime-100 text-pine-950 border-lime-300"
                      }`}
                    >
                      {product.category.toUpperCase()} INSURANCE
                    </span>
                    <span className={`text-xs font-semibold ${isFeatured ? "text-slate-400" : "text-slate-500"}`}>
                      {product.provider_name}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xl font-extrabold tracking-tight ${isFeatured ? "text-white" : "text-pine-950"}`}>
                      {product.name}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isFeatured ? "text-slate-300" : "text-slate-500"}`}>
                      {product.description}
                    </p>
                  </div>

                  {/* PRICING & SUM ASSURED STRIP */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 text-xs ${
                      isFeatured
                        ? "bg-pine-900/70 border-pine-800"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={isFeatured ? "text-slate-300" : "text-slate-500"}>
                        Base Annual Premium:
                      </span>
                      <span
                        className={`font-extrabold font-mono text-base ${
                          isFeatured ? "text-lime-400" : "text-pine-950"
                        }`}
                      >
                        {formatCurrencyINR(Number(product.base_premium))} <span className="text-[10px] font-normal font-sans">/ yr</span>
                      </span>
                    </div>

                    <div className={`flex justify-between items-center pt-1.5 border-t ${isFeatured ? "border-pine-800" : "border-slate-200/60"}`}>
                      <span className={isFeatured ? "text-slate-300" : "text-slate-500"}>
                        Sum Assured / Max Cover:
                      </span>
                      <span className="font-extrabold font-mono text-sm text-emerald-500">
                        {formatCurrencyINR(Number(product.coverage_amount))}
                      </span>
                    </div>
                  </div>

                  {/* POLICY HIGHLIGHTS */}
                  {features.length > 0 && (
                    <ul className={`space-y-1.5 text-xs pt-1 ${isFeatured ? "text-slate-300" : "text-slate-600"}`}>
                      {features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className={`mt-6 pt-5 border-t flex gap-2 ${isFeatured ? "border-pine-900" : "border-slate-100"}`}>
                  <Button
                    variant={isFeatured ? "lime" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setInspectProduct(product)}
                  >
                    <Info className="mr-1.5 h-3.5 w-3.5" /> Inspect Criteria
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={isFeatured ? "bg-pine-900 border-pine-800 text-white hover:bg-pine-800" : ""}
                  >
                    <Link href="/clients/new">
                      Onboard <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CARRIER PARTNERS SECTION FROM PREVIEW.HTML */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-pine-950 tracking-tight flex items-center gap-2">
              <Building2 className="h-5 w-5 text-pine-950" /> Integrated Insurance Underwriters
            </h3>
            <p className="text-xs text-slate-500">
              Institutional carrier products with automated document issuance and verified eligibility
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CARRIER_PARTNERS.map((carrier, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-400 transition shadow-sm flex flex-col items-center justify-center text-center space-y-1"
            >
              <span className="font-extrabold text-slate-900 text-base">{carrier.logoText}</span>
              <span className="text-[11px] text-slate-400 font-medium">{carrier.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* INSPECT PRODUCT & ELIGIBILITY RULES MODAL */}
      {inspectProduct && (
        <Dialog open={true} onOpenChange={() => setInspectProduct(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="lime" className="uppercase">
                  {inspectProduct.category}
                </Badge>
                <span className="text-xs font-semibold text-slate-500">
                  {inspectProduct.provider_name}
                </span>
              </div>
              <DialogTitle className="mt-2 text-2xl font-extrabold text-pine-950">
                {inspectProduct.name}
              </DialogTitle>
              <DialogDescription>
                Policy Identifier: <strong className="font-mono text-pine-950">{inspectProduct.code}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">{inspectProduct.description}</p>

              {/* FINANCIAL SUMMARY */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 gap-4 font-mono">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                    Base Annual Premium
                  </span>
                  <span className="text-base font-extrabold text-pine-950">
                    {formatCurrencyINR(Number(inspectProduct.base_premium))} / yr
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                    Coverage Amount
                  </span>
                  <span className="text-base font-extrabold text-emerald-700">
                    {formatCurrencyINR(Number(inspectProduct.coverage_amount))}
                  </span>
                </div>
              </div>

              {/* DETERMINISTIC UNDERWRITING RULES */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Deterministic Eligibility Rules:
                </span>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-slate-700">
                  {inspectProduct.eligibility_rules ? (
                    <>
                      {(inspectProduct.eligibility_rules as RuleCriteria).min_age !== undefined && (
                        <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                          <span className="text-slate-500">Age Bracket:</span>
                          <span className="font-bold">
                            {(inspectProduct.eligibility_rules as RuleCriteria).min_age} to {(inspectProduct.eligibility_rules as RuleCriteria).max_age || 65} years
                          </span>
                        </div>
                      )}
                      {(inspectProduct.eligibility_rules as RuleCriteria).min_income !== undefined && (
                        <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                          <span className="text-slate-500">Min Annual Income:</span>
                          <span className="font-bold font-mono">
                            {formatCurrencyINR((inspectProduct.eligibility_rules as RuleCriteria).min_income!)}
                          </span>
                        </div>
                      )}
                      {(inspectProduct.eligibility_rules as RuleCriteria).allow_smoker !== undefined && (
                        <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                          <span className="text-slate-500">Smoker Policy:</span>
                          <span className="font-bold">
                            {(inspectProduct.eligibility_rules as RuleCriteria).allow_smoker
                              ? "Allowed (Actuarial loading applies)"
                              : "Strictly Non-Smokers only"}
                          </span>
                        </div>
                      )}
                      {(inspectProduct.eligibility_rules as RuleCriteria).disallowed_medical && (
                        <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                          <span className="text-slate-500">Disallowed Pre-Existing:</span>
                          <span className="font-bold text-rose-700">
                            {(inspectProduct.eligibility_rules as RuleCriteria).disallowed_medical!.join(", ")}
                          </span>
                        </div>
                      )}
                      {(inspectProduct.eligibility_rules as RuleCriteria).allowed_vehicle_types && (
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-500">Allowed Vehicle Types:</span>
                          <span className="font-bold capitalize">
                            {(inspectProduct.eligibility_rules as RuleCriteria).allowed_vehicle_types!.map((t) => t.replace("_", " ")).join(", ")}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-500">No strict restrictions configured.</p>
                  )}
                </div>
              </div>

              {/* FEATURES */}
              {Array.isArray(inspectProduct.features) && (inspectProduct.features as string[]).length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Key Highlights & Inclusions:
                  </span>
                  <ul className="space-y-1.5 pl-1">
                    {(inspectProduct.features as string[]).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline" onClick={() => setInspectProduct(null)} className="w-full sm:w-auto">
                Close
              </Button>
              <Button variant="lime" asChild className="w-full sm:w-auto">
                <Link href="/clients/new">
                  <UserPlus className="mr-1.5 h-4 w-4" /> Onboard Client for this Plan
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
