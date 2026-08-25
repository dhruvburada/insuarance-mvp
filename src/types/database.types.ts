export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      agents: {
        Row: {
          agency_name: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          agency_name?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          agency_name?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          activated_at: string | null;
          agent_id: string;
          client_id: string;
          coverage_amount: number;
          created_at: string;
          id: string;
          pdf_storage_path: string | null;
          premium_amount: number;
          product_id: string;
          product_snapshot: Json;
          status: string;
          updated_at: string;
        };
        Insert: {
          activated_at?: string | null;
          agent_id: string;
          client_id: string;
          coverage_amount: number;
          created_at?: string;
          id?: string;
          pdf_storage_path?: string | null;
          premium_amount: number;
          product_id: string;
          product_snapshot: Json;
          status?: string;
          updated_at?: string;
        };
        Update: {
          activated_at?: string | null;
          agent_id?: string;
          client_id?: string;
          coverage_amount?: number;
          created_at?: string;
          id?: string;
          pdf_storage_path?: string | null;
          premium_amount?: number;
          product_id?: string;
          product_snapshot?: Json;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "insurance_products";
            referencedColumns: ["id"];
          }
        ];
      };
      clients: {
        Row: {
          agent_id: string;
          annual_income: number;
          city: string | null;
          created_at: string;
          dob: string;
          email: string;
          first_name: string;
          gender: string;
          id: string;
          is_smoker: boolean;
          last_name: string;
          medical_history: Json;
          occupation: string | null;
          phone: string;
          pincode: string | null;
          updated_at: string;
          vehicle_details: Json;
        };
        Insert: {
          agent_id: string;
          annual_income?: number;
          city?: string | null;
          created_at?: string;
          dob: string;
          email: string;
          first_name: string;
          gender: string;
          id?: string;
          is_smoker?: boolean;
          last_name: string;
          medical_history?: Json;
          occupation?: string | null;
          phone: string;
          pincode?: string | null;
          updated_at?: string;
          vehicle_details?: Json;
        };
        Update: {
          agent_id?: string;
          annual_income?: number;
          city?: string | null;
          created_at?: string;
          dob?: string;
          email?: string;
          first_name?: string;
          gender?: string;
          id?: string;
          is_smoker?: boolean;
          last_name?: string;
          medical_history?: Json;
          occupation?: string | null;
          phone?: string;
          pincode?: string | null;
          updated_at?: string;
          vehicle_details?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "clients_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          }
        ];
      };
      insurance_products: {
        Row: {
          base_premium: number;
          category: string;
          code: string;
          coverage_amount: number;
          created_at: string;
          description: string;
          eligibility_rules: Json;
          features: Json;
          id: string;
          is_active: boolean;
          name: string;
          provider_name: string;
          updated_at: string;
        };
        Insert: {
          base_premium: number;
          category: string;
          code: string;
          coverage_amount: number;
          created_at?: string;
          description: string;
          eligibility_rules?: Json;
          features?: Json;
          id?: string;
          is_active?: boolean;
          name: string;
          provider_name: string;
          updated_at?: string;
        };
        Update: {
          base_premium?: number;
          category?: string;
          code?: string;
          coverage_amount?: number;
          created_at?: string;
          description?: string;
          eligibility_rules?: Json;
          features?: Json;
          id?: string;
          is_active?: boolean;
          name?: string;
          provider_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          agent_id: string;
          amount: number;
          application_id: string;
          client_id: string;
          created_at: string;
          currency: string;
          id: string;
          paid_at: string | null;
          payment_link_url: string;
          raw_webhook_payload: Json | null;
          razorpay_payment_id: string | null;
          razorpay_payment_link_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          agent_id: string;
          amount: number;
          application_id: string;
          client_id: string;
          created_at?: string;
          currency?: string;
          id?: string;
          paid_at?: string | null;
          payment_link_url: string;
          raw_webhook_payload?: Json | null;
          razorpay_payment_id?: string | null;
          razorpay_payment_link_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          agent_id?: string;
          amount?: number;
          application_id?: string;
          client_id?: string;
          created_at?: string;
          currency?: string;
          id?: string;
          paid_at?: string | null;
          payment_link_url?: string;
          raw_webhook_payload?: Json | null;
          razorpay_payment_id?: string | null;
          razorpay_payment_link_id?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "agents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
