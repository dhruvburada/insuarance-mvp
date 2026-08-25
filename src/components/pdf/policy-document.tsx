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
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
    fontSize: 10,
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
    fontSize: 9,
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
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#f8fafc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#061B1E",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    padding: 12,
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
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  dataLabel: {
    color: "#64748b",
    fontSize: 9,
  },
  dataValue: {
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    fontSize: 9,
  },
  financialBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  financialTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1.5,
    borderTopColor: "#061B1E",
  },
  financialTotalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#061B1E",
  },
  financialTotalValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  featureBullet: {
    color: "#059669",
    fontFamily: "Helvetica-Bold",
    marginRight: 6,
  },
  featureText: {
    fontSize: 9,
    color: "#334155",
  },
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  disclaimer: {
    fontSize: 7.5,
    color: "#94a3b8",
    textAlign: "justify",
    lineHeight: 1.3,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
  },
  signatureBox: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#94a3b8",
    paddingTop: 4,
    textAlign: "center",
  },
  signatureText: {
    fontSize: 8,
    color: "#64748b",
  },
});

interface PolicyDocumentPDFProps {
  application: Application;
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
  const premium = Number(application.premium_amount || product.base_premium || 0);
  const coverage = Number(application.coverage_amount || product.coverage_amount || 0);
  const gstAmount = Math.round(premium * 0.18);
  const totalPayable = premium + gstAmount;

  const features = Array.isArray(product.features) ? (product.features as string[]) : [];
  const medicalHistory = (client.medical_history as Record<string, any>) || {};
  const vehicleDetails = (client.vehicle_details as Record<string, any>) || {};

  const birthYear = client.dob ? new Date(client.dob).getFullYear() : null;
  const age = birthYear ? new Date().getFullYear() - birthYear : "N/A";

  const formattedDate = new Date(application.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
            OFFICIAL POLICY PROPOSAL & SCHEDULE
          </Text>
          <Text style={styles.docSubtitle}>
            Personalized Insurance Quotation & Underwriting Summary
          </Text>

          <View style={styles.metaGrid}>
            <Text style={styles.metaItem}>
              Proposal Ref: <Text style={styles.metaItemBold}>QTE-{application.id.slice(0, 8).toUpperCase()}</Text>
            </Text>
            <Text style={styles.metaItem}>
              Date: <Text style={styles.metaItemBold}>{formattedDate}</Text>
            </Text>
            <Text style={styles.metaItem}>
              Status: <Text style={styles.metaItemBold}>{application.status.toUpperCase()}</Text>
            </Text>
          </View>
        </View>

        {/* CLIENT & INSURED PROFILE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>1. Insured Proposer Details</Text>
            <Text style={{ fontSize: 8, color: "#64748b" }}>KYC Verified</Text>
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

        {/* POLICY SPECIFICATION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>2. Policy Coverage Schedule</Text>
            <Text style={{ fontSize: 8, color: "#64748b" }}>Category: {product.category.toUpperCase()}</Text>
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
              <Text style={styles.dataLabel}>Policy Term / Renewal:</Text>
              <Text style={styles.dataValue}>1 Year (Annual Recurring)</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Sum Assured / Max Limit:</Text>
              <Text style={{ fontFamily: "Helvetica-Bold", color: "#059669", fontSize: 10 }}>
                INR {coverage.toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        {/* FINANCIAL PREMIUM BREAKDOWN */}
        <View style={styles.financialBox}>
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
            3. Premium Computation & Tax Statement
          </Text>

          <View style={styles.financialRow}>
            <Text style={styles.dataLabel}>Annual Net Base Premium:</Text>
            <Text style={styles.dataValue}>INR {premium.toLocaleString("en-IN")}.00</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.dataLabel}>Goods & Services Tax (GST @ 18%):</Text>
            <Text style={styles.dataValue}>INR {gstAmount.toLocaleString("en-IN")}.00</Text>
          </View>

          <View style={styles.financialTotalRow}>
            <Text style={styles.financialTotalLabel}>Total Annual Payable Premium:</Text>
            <Text style={styles.financialTotalValue}>INR {totalPayable.toLocaleString("en-IN")}.00 / yr</Text>
          </View>
        </View>

        {/* KEY HIGHLIGHTS & INCLUSIONS */}
        {features.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>4. Key Benefits & Inclusions</Text>
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
            REGULATORY NOTICE: Insurance is the subject matter of solicitation. This document is a personalized quotation proposal prepared by {agencyName} based on information submitted during client intake. Policy issuance is subject to carrier underwriting approval and realization of premium via Razorpay.
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Prepared by: {agentName}</Text>
              <Text style={{ fontSize: 7, color: "#94a3b8" }}>Authorized Insurance Advisor</Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Underwriting Carrier Partner</Text>
              <Text style={{ fontSize: 7, color: "#94a3b8" }}>{product.provider_name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
