import { Resend } from "resend";

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

export async function sendPolicyActivationEmail(params: {
  toEmail: string;
  clientName: string;
  policyName: string;
  coverageAmount: number;
  premiumAmount: number;
  quoteUrl?: string;
}) {
  const resend = getResendClient();
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || "onboarding@resend.dev";

  return resend.emails.send({
    from: fromAddress,
    to: params.toEmail,
    subject: `Your ${params.policyName} Insurance is Now Active!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #16a34a;">Policy Activation Confirmation</h2>
        <p>Dear <strong>${params.clientName}</strong>,</p>
        <p>Congratulations! Your payment for <strong>${params.policyName}</strong> has been successfully received, and your policy is now <strong>Active</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Policy Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${params.policyName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Coverage Sum Assured:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">₹${params.coverageAmount.toLocaleString("en-IN")}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Premium Paid:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">₹${params.premiumAmount.toLocaleString("en-IN")}</td></tr>
        </table>
        <p>Thank you for choosing our platform. Reach out to your agent for any claims or queries.</p>
      </div>
    `,
  });
}
