import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Client, InsuranceProduct, Application } from "@/types/product.types";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    backgroundColor: "#ffffff",
    lineHeight: 1.4,
  },
  headerBanner: {
    backgroundColor: "#061B1E",
    color: "#ffffff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#0E3338",
    paddingBottom: 8,
  },
  brandName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  brandAccent: {
    color: "#DCF763",
  },
  carrierBadge: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#DCF763",
    backgroundColor: "#0A262A",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  docTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  docSubtitle: {
    fontSize: 8.5,
    color: "#94a3b8",
  },
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#0E3338",
  },
  metaItem: {
    fontSize: 8,
    color: "#cbd5e1",
  },
  metaItemBold: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
  },
  paidBanner: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paidBannerTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#065f46",
  },
  paidBannerSubtitle: {
    fontSize: 8,
    color: "#047857",
    marginTop: 2,
  },
  paidBadge: {
    backgroundColor: "#059669",
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  section: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#f8fafc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#061B1E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    padding: 10,
  },
  twoColGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    width: "48%",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  dataLabel: {
    color: "#64748b",
    fontSize: 8.5,
  },
  dataValue: {
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    fontSize: 8.5,
  },
  financialBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  financialTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1.5,
    borderTopColor: "#061B1E",
  },
  financialTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#061B1E",
  },
  financialTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  featureBullet: {
    color: "#059669",
    fontFamily: "Helvetica-Bold",
    marginRight: 6,
    fontSize: 8.5,
  },
  featureText: {
    fontSize: 8.5,
    color: "#334155",
  },
  footer: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  disclaimer: {
    fontSize: 7,
    color: "#94a3b8",
    textAlign: "justify",
    lineHeight: 1.3,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
  },
  signatureBox: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    paddingTop: 4,
    textAlign: "center",
  },
  signatureText: {
    fontSize: 7.5,
    color: "#64748b",
  },
});

interface PolicyDocumentPDFProps {
  application: Application & { payments?: any[] };
  client: Client;
  product: InsuranceProduct;
  agentName?: string;
  agencyName?: string;
}

export function PolicyDocumentPDF({
  application,
  client,
  product,
  agentName = "Licensed Insurance Advisor",
  agencyName = "InsureAgent Distribution Network",
}: PolicyDocumentPDFProps) {
  const isPaid = application.status === "active";
  const payment = Array.isArray((application as any).payments)
    ? (application as any).payments[0]
    : null;

  const premium = Number(application.premium_amount || product.base_premium || 0);
  const coverage = Number(application.coverage_amount || product.coverage_amount || 0);
  const gstAmount = Math.round(premium * 0.18);
  const totalPayable = premium + gstAmount;

  const features = Array.isArray(product.features) ? (product.features as string[]) : [];

  const birthYear = client.dob ? new Date(client.dob).getFullYear() : null;
  const age = birthYear ? new Date().getFullYear() - birthYear : "N/A";

  const formattedDate = new Date(
    isPaid && application.activated_at ? application.activated_at : application.created_at
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const refPrefix = isPaid ? "POL" : "QTE";
  const refCode = `${refPrefix}-${application.id.slice(0, 8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER BANNER */}
        <View style={styles.headerBanner}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>
              Insure<Text style={styles.brandAccent}>Agent</Text>
            </Text>
            <Text style={styles.carrierBadge}>{product.provider_name.toUpperCase()}</Text>
          </View>

          <Text style={styles.docTitle}>
            {isPaid ? "OFFICIAL INSURANCE POLICY CERTIFICATE" : "OFFICIAL POLICY PROPOSAL & SCHEDULE"}
          </Text>
          <Text style={styles.docSubtitle}>
            {isPaid
              ? "Verified Active Insurance Policy & Schedule Issued via Licensed Distribution Network"
              : "Personalized Insurance Quotation & Underwriting Summary"}
          </Text>

          <View style={styles.metaGrid}>
            <Text style={styles.metaItem}>
              {isPaid ? "Policy Certificate No:" : "Proposal Ref:"}{" "}
              <Text style={styles.metaItemBold}>{refCode}</Text>
            </Text>
            <Text style={styles.metaItem}>
              Issue Date: <Text style={styles.metaItemBold}>{formattedDate}</Text>
            </Text>
            <Text style={styles.metaItem}>
              Status:{" "}
              <Text style={styles.metaItemBold}>
                {isPaid ? "ACTIVE (PAID IN FULL)" : application.status.toUpperCase()}
              </Text>
            </Text>
          </View>
        </View>

        {/* PAYMENT VERIFICATION STATUS BANNER (IF PAID) */}
        {isPaid && (
          <View style={styles.paidBanner}>
            <View>
              <Text style={styles.paidBannerTitle}>
                ✓ Payment Verified & Policy Active
              </Text>
              <Text style={styles.paidBannerSubtitle}>
                Payment Ref: {payment?.razorpay_payment_id || "pay_verified"} • Settled via Razorpay
              </Text>
            </View>
            <Text style={styles.paidBadge}>VERIFIED PAID</Text>
          </View>
        )}

        {/* 1. CLIENT & INSURED PROFILE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>1. Insured Proposer Details</Text>
            <Text style={{ fontSize: 7.5, color: "#64748b" }}>KYC Verified</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.twoColGrid}>
              <View style={styles.col}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Proposer Name:</Text>
                  <Text style={styles.dataValue}>{client.first_name} {client.last_name}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Date of Birth / Age:</Text>
                  <Text style={styles.dataValue}>{client.dob} ({age} yrs)</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Gender:</Text>
                  <Text style={styles.dataValue}>{client.gender.toUpperCase()}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Contact Phone:</Text>
                  <Text style={styles.dataValue}>{client.phone}</Text>
                </View>
              </View>

              <View style={styles.col}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Email Address:</Text>
                  <Text style={styles.dataValue}>{client.email}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Location:</Text>
                  <Text style={styles.dataValue}>{client.city || "Urban Region"}, {client.pincode || ""}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Occupation:</Text>
                  <Text style={styles.dataValue}>{client.occupation || "Salaried"}</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Tobacco / Smoking:</Text>
                  <Text style={styles.dataValue}>{client.is_smoker ? "Active User" : "Non-Smoker (Clean)"}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 2. POLICY SPECIFICATION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>2. Policy Coverage Schedule</Text>
            <Text style={{ fontSize: 7.5, color: "#64748b" }}>Category: {product.category.toUpperCase()}</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Plan Name:</Text>
              <Text style={styles.dataValue}>{product.name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Underwriting Insurer:</Text>
              <Text style={styles.dataValue}>{product.provider_name}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Product Code:</Text>
              <Text style={styles.dataValue}>{product.code}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Policy Term / Validity:</Text>
              <Text style={styles.dataValue}>1 Year (Annual Recurring)</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Sum Assured / Max Cover:</Text>
              <Text style={{ fontFamily: "Helvetica-Bold", color: "#059669", fontSize: 9.5 }}>
                INR {coverage.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. FINANCIAL STATEMENT & PAYMENT SETTLEMENT */}
        <View style={styles.financialBox}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <Text style={styles.sectionTitle}>3. Premium Computation & Settlement Status</Text>
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: isPaid ? "#059669" : "#d97706" }}>
              {isPaid ? "STATUS: PAID" : "STATUS: PENDING PAYMENT"}
            </Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.dataLabel}>Annual Net Base Premium:</Text>
            <Text style={styles.dataValue}>INR {premium.toLocaleString("en-IN")}.00</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.dataLabel}>Goods & Services Tax (GST @ 18%):</Text>
            <Text style={styles.dataValue}>INR {gstAmount.toLocaleString("en-IN")}.00</Text>
          </View>

          <View style={styles.financialTotalRow}>
            <Text style={styles.financialTotalLabel}>Total Annual Premium Paid:</Text>
            <Text style={styles.financialTotalValue}>INR {totalPayable.toLocaleString("en-IN")}.00</Text>
          </View>

          {isPaid && payment && (
            <View style={{ marginTop: 6, paddingTop: 6, borderTopWidth: 0.5, borderTopColor: "#cbd5e1" }}>
              <View style={styles.financialRow}>
                <Text style={styles.dataLabel}>Payment Gateway:</Text>
                <Text style={styles.dataValue}>Razorpay Secure Payments</Text>
              </View>
              <View style={styles.financialRow}>
                <Text style={styles.dataLabel}>Payment Transaction ID:</Text>
                <Text style={[styles.dataValue, { color: "#059669" }]}>
                  {payment.razorpay_payment_id || "pay_verified"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 4. KEY HIGHLIGHTS & INCLUSIONS */}
        {features.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>4. Key Benefits & Policy Inclusions</Text>
            </View>
            <View style={styles.sectionContent}>
              {features.map((f, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>[✓]</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FOOTER & REGULATORY DISCLAIMER */}
        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            REGULATORY NOTICE: Insurance is the subject matter of solicitation. This official document is issued by {agencyName} in partnership with {product.provider_name}. Premium has been realized in full and coverage is active as per policy underwriting guidelines.
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Prepared & Verified: {agentName}</Text>
              <Text style={{ fontSize: 6.5, color: "#94a3b8" }}>Authorized Insurance Advisor</Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Underwriting Carrier Partner</Text>
              <Text style={{ fontSize: 6.5, color: "#94a3b8" }}>{product.provider_name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
