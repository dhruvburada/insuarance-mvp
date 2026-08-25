"use server";

import { createClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay/client";
import { revalidatePath } from "next/cache";

export async function createPaymentLinkAction(applicationId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized. Please log in as an agent to generate payment links.");
  }

  const { data: applicationData, error: appError } = await supabase
    .from("applications")
    .select(`
      id,
      premium_amount,
      coverage_amount,
      client:clients(id, first_name, last_name, email, phone),
      product:insurance_products(name, code, provider_name)
    `)
    .eq("id", applicationId)
    .eq("agent_id", user.id)
    .single();

  if (appError || !applicationData) {
    throw new Error("Application record not found or unauthorized.");
  }

  const application = applicationData as any;
  const client = application.client;
  const product = application.product;

  const razorpay = getRazorpayClient();
  const amountInPaise = Math.round(Number(application.premium_amount) * 100);

  // Sanitize phone number (remove +, spaces, dashes; fallback to 10 digits)
  const rawPhone = client?.phone || "9876543210";
  let cleanPhone = rawPhone.replace(/\D/g, "");
  if (cleanPhone.length > 10 && cleanPhone.startsWith("91")) {
    cleanPhone = cleanPhone.slice(2);
  }
  if (cleanPhone.length < 10) {
    cleanPhone = cleanPhone.padStart(10, "9");
  }

  const customerName = `${client?.first_name || ""} ${client?.last_name || ""}`.trim() || "Proposer Client";
  const customerEmail = client?.email || "customer@example.com";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const paymentLinkPayload = {
    amount: amountInPaise,
    currency: "INR",
    accept_partial: false,
    description: `Premium for ${product?.name || "Insurance Plan"} - ${customerName}`,
    customer: {
      name: customerName,
      email: customerEmail,
      contact: cleanPhone,
    },
    notify: {
      sms: false,
      email: false,
    },
    reminder_enable: false,
    callback_url: `${appUrl}/quote/${application.id}?payment=completed`,
    callback_method: "get" as const,
    notes: {
      application_id: application.id,
      agent_id: user.id,
      client_id: client?.id || "",
      product_name: product?.name || "",
    },
  };

  const paymentLink = await razorpay.paymentLink.create(paymentLinkPayload as any);

  if (!paymentLink || !paymentLink.id || !paymentLink.short_url) {
    throw new Error("Failed to receive payment link from Razorpay.");
  }

  const { error: paymentInsertError } = await (supabase.from("payments") as any).insert({
    application_id: application.id,
    agent_id: user.id,
    client_id: client.id,
    razorpay_payment_link_id: paymentLink.id,
    payment_link_url: paymentLink.short_url,
    amount: Number(application.premium_amount),
    currency: "INR",
    status: "pending",
  });

  if (paymentInsertError) {
    throw new Error(`Failed to record payment in database: ${paymentInsertError.message}`);
  }

  await (supabase.from("applications") as any)
    .update({ status: "payment_pending" })
    .eq("id", application.id);

  revalidatePath(`/clients/${client.id}`);
  revalidatePath("/payments");
  revalidatePath(`/quote/${application.id}`);

  return {
    paymentLinkId: paymentLink.id,
    paymentLinkUrl: paymentLink.short_url,
  };
}
