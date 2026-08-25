import { createClient } from "@/lib/supabase/server";
import { InsuranceProduct } from "@/types/product.types";
import ProductsView from "./products-view";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const supabase = createClient();

  const { data: productsData } = await supabase
    .from("insurance_products")
    .select("*")
    .eq("is_active", true)
    .order("category");

  const products = (productsData || []) as InsuranceProduct[];

  return <ProductsView products={products} />;
}
