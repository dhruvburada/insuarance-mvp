"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Application, InsuranceProduct } from "@/types/product.types";

export async function createQuoteAction(params: {
  clientId: string;
  productId: string;
  premiumAmount: number;
  coverageAmount: number;
}): Promise<Application> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: productData, error: productError } = await supabase
    .from("insurance_products")
    .select("*")
    .eq("id", params.productId)
    .single();

  if (productError || !productData) {
    throw new Error("Insurance product not found");
  }

  const product = productData as InsuranceProduct;

  const { data: applicationData, error: insertError } = await supabase
    .from("applications")
    .insert({
      agent_id: user.id,
      client_id: params.clientId,
      product_id: params.productId,
      status: "quoted",
      premium_amount: params.premiumAmount,
      coverage_amount: params.coverageAmount,
      product_snapshot: product as any,
    } as any)
    .select()
    .single();

  if (insertError || !applicationData) {
    throw new Error(`Failed to create quote: ${insertError?.message || "Unknown error"}`);
  }

  revalidatePath(`/clients/${params.clientId}`);
  return applicationData as Application;
}
