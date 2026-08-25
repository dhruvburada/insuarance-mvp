import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPolicyActivationEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret || !signature) {
      return NextResponse.json(
        { error: "Webhook secret or signature missing" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment_link.paid") {
      const paymentLink = payload.payload.payment_link.entity;
      const payment = payload.payload.payment.entity;

      const supabase = createAdminClient();

      const { data: existingPaymentData } = await supabase
        .from("payments")
        .select("id, status, amount, application_id, client:clients(*), application:applications(*, product:insurance_products(*))")
        .eq("razorpay_payment_link_id", paymentLink.id)
        .single();

      if (!existingPaymentData) {
        return NextResponse.json(
          { error: "Payment record not found" },
          { status: 404 }
        );
      }

      const existingPayment = existingPaymentData as any;

      if (existingPayment.status === "paid") {
        return NextResponse.json({ status: "already_processed" }, { status: 200 });
      }

      const now = new Date().toISOString();

      await supabase
        .from("payments")
        .update({
          status: "paid",
          razorpay_payment_id: payment.id,
          paid_at: now,
          raw_webhook_payload: payload,
        })
        .eq("id", existingPayment.id);

      await supabase
        .from("applications")
        .update({
          status: "active",
          activated_at: now,
        })
        .eq("id", existingPayment.application_id);

      const client = existingPayment.client as any;
      const app = existingPayment.application as any;
      const product = app?.product as any;

      if (client?.email) {
        try {
          await sendPolicyActivationEmail({
            toEmail: client.email,
            clientName: `${client.first_name} ${client.last_name}`,
            policyName: product?.name || "Insurance Policy",
            coverageAmount: Number(app?.coverage_amount || 0),
            premiumAmount: Number(existingPayment.amount || 0),
          });
        } catch (emailErr) {
          console.error("Failed to send activation email:", emailErr);
        }
      }

      return NextResponse.json({ status: "success" }, { status: 200 });
    }

    return NextResponse.json({ status: "ignored_event" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
