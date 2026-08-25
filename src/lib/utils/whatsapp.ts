export function formatE164IndianPhone(phone: string): string {
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  if (digitsOnly.startsWith("91") && digitsOnly.length === 12) {
    return digitsOnly;
  }
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  return digitsOnly;
}

export function buildProposalWhatsAppUrl(
  phone: string,
  clientName: string,
  policyName: string,
  quoteUrl: string
): string {
  const formattedPhone = formatE164IndianPhone(phone);
  const text = `Hello ${clientName},\n\nI have prepared your personalized insurance proposal for *${policyName}*.\n\n📄 View your proposal and coverage details here:\n${quoteUrl}\n\nPlease let me know if you would like to proceed!`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}

export function buildPaymentWhatsAppUrl(
  phone: string,
  clientName: string,
  policyName: string,
  amount: number,
  paymentUrl: string
): string {
  const formattedPhone = formatE164IndianPhone(phone);
  const text = `Hello ${clientName},\n\nYour policy application for *${policyName}* (Premium: ₹${amount.toLocaleString("en-IN")}) is ready for activation.\n\n💳 Complete your secure payment here:\n${paymentUrl}\n\nOnce paid, your policy will be activated instantly and confirmation sent to your email.`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}
