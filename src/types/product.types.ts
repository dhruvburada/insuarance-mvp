import { Database } from "./database.types";

export type Agent = Database["public"]["Tables"]["agents"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type InsuranceProduct = Database["public"]["Tables"]["insurance_products"]["Row"];
export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];

export type PolicyCategory = "term" | "health" | "vehicle";
export type ApplicationStatus = "draft" | "quoted" | "payment_pending" | "active" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "expired";
