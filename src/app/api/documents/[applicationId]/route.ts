import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const supabase = createClient();
    const { data: applicationData, error } = await supabase
      .from("applications")
      .select(`
        id,
        status,
        premium_amount,
        coverage_amount,
        created_at,
        client:clients(*),
        product:insurance_products(*)
      `)
      .eq("id", params.applicationId)
      .single();

    if (error || !applicationData) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const application = applicationData as any;

    return NextResponse.json({
      applicationId: application.id,
      status: application.status,
      premium: application.premium_amount,
      coverage: application.coverage_amount,
      client: application.client,
      product: application.product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate document" },
      { status: 500 }
    );
  }
}
