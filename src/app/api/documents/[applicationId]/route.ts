import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PolicyDocumentPDF } from "@/components/pdf/policy-document";
import React from "react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { applicationId: string } }
) {
  try {
    const supabase = createClient();
    const { data: applicationData, error } = await supabase
      .from("applications")
      .select(`
        *,
        client:clients(*),
        product:insurance_products(*)
      `)
      .eq("id", params.applicationId)
      .single();

    if (error || !applicationData) {
      return NextResponse.json(
        { error: "Insurance proposal document not found" },
        { status: 404 }
      );
    }

    const application = applicationData as any;
    const client = application.client;
    const product = application.product;

    if (!client || !product) {
      return NextResponse.json(
        { error: "Incomplete client or product data for proposal" },
        { status: 400 }
      );
    }

    // Fetch agent name if available
    let agentName = "Licensed Insurance Advisor";
    if (application.agent_id) {
      const { data: agentData } = await supabase
        .from("agents")
        .select("full_name, agency_name")
        .eq("id", application.agent_id)
        .single();
      const agent = agentData as { full_name?: string; agency_name?: string } | null;
      if (agent?.full_name) {
        agentName = agent.full_name;
      }
    }

    // Render PDF Document
    const pdfElement = React.createElement(PolicyDocumentPDF, {
      application,
      client,
      product,
      agentName,
    });

    const pdfBuffer = await renderToBuffer(pdfElement as any);
    const sanitizedTitle = (product.name || "Insurance").replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedClient = (client.last_name || "Client").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `Proposal_${sanitizedTitle}_${sanitizedClient}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate insurance proposal PDF";
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
