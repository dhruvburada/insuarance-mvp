import { createClient } from "@/lib/supabase/server";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { InsuranceProduct } from "@/types/product.types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = createClient();

  const { data: productsData } = await supabase
    .from("insurance_products")
    .select("*")
    .eq("is_active", true)
    .order("category");

  const products = (productsData || []) as InsuranceProduct[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-tight">
          Insurance Product Master Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pre-seeded institutional policies with deterministic eligibility rule constraints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const features = (product.features as string[]) || [];

          return (
            <Card
              key={product.id}
              className="p-7 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="lime" className="uppercase">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-slate-400 font-semibold">{product.provider_name}</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-pine-950 leading-snug">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{product.description}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Base Premium:</span>
                    <span className="font-extrabold text-pine-950 font-mono text-sm">
                      {formatCurrencyINR(Number(product.base_premium))} / yr
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">Sum Assured:</span>
                    <span className="font-extrabold text-emerald-700 font-mono text-sm">
                      {formatCurrencyINR(Number(product.coverage_amount))}
                    </span>
                  </div>
                </div>

                {features.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Code: {product.code}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
