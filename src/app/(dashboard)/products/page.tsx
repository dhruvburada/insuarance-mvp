import { createClient } from "@/lib/supabase/server";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import { InsuranceProduct } from "@/types/product.types";

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
        <h1 className="text-2xl font-bold text-slate-900">Insurance Product Catalog</h1>
        <p className="text-slate-600 text-sm mt-1">
          Master catalog of pre-configured Term, Health, and Motor insurance policies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const features = (product.features as string[]) || [];

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded bg-blue-50 text-primary">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{product.provider_name}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{product.description}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Premium:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrencyINR(Number(product.base_premium))} / yr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sum Assured:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrencyINR(Number(product.coverage_amount))}
                    </span>
                  </div>
                </div>

                {features.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-700">Features:</span>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600">
                      {features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-emerald-500">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-xs text-slate-400">
                Code: {product.code}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
