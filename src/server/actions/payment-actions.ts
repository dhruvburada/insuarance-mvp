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
    throw new Error("Unauthorized");
  }

  const { data: applicationData, error: appError } = await supabase
    .from("applications")
    .select(`
      id,
      premium_amount,
      client:clients(id, first_name, last_name, email, phone),
      product:insurance_products(name)
    `)
    .eq("id", applicationId)
    .eq("agent_id", user.id)
    .single();

  if (appError || !applicationData) {
    throw new Error("Application not found or inaccessible");
  }

  const application = applicationData as any;
  const client = application.client;
  const product = application.product;

  const razorpay = getRazorpayClient();
  const amountInPaise = Math.round(Number(application.premium_amount) * 100);

  const paymentLink = await razorpay.paymentLink.create({
    amount: amountInPaise,
    currency: "INR",
    accept_partial: false,
    description: `Premium for ${product?.name || "Insurance"} - ${client?.first_name} ${client?.last_name}`,
    customer: {
      name: `${client?.first_name} ${client?.last_name}`,
      email: client?.email,
      contact: client?.phone,
    },
    notify: {
      sms: false,
      email: false,
    },
    notes: {
      application_id: application.id,
      agent_id: user.id,
      client_id: client?.id,
    },
  });

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
    throw new Error(`Failed to record payment: ${paymentInsertError.message}`);
  }

  await (supabase.from("applications") as any)
    .update({ status: "payment_pending" })
    .eq("id", application.id);

  revalidatePath(`/clients/${client.id}`);
  revalidatePath("/payments");

  return {
    paymentLinkId: paymentLink.id,
    paymentLinkUrl: paymentLink.short_url,
  };
}
