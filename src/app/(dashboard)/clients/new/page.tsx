"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import ClientForm from "@/components/forms/client-form";
import { ClientFormValues } from "@/lib/utils/validators";
import { Database } from "@/types/database.types";

export default function NewClientPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleClientSubmit = async (values: ClientFormValues) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Authentication required. Please log in to create a client dossier.");
    }

    const payload: Database["public"]["Tables"]["clients"]["Insert"] = {
      agent_id: user.id,
      first_name: values.first_name,
      last_name: values.last_name,
      dob: values.dob,
      gender: values.gender,
      email: values.email,
      phone: values.phone,
      annual_income: Number(values.annual_income),
      occupation: values.occupation,
      is_smoker: values.is_smoker,
      city: values.city,
      pincode: values.pincode,
      medical_history: {
        ...values.medical_history,
        notes: values.medical_history.notes || "",
      },
      vehicle_details: {
        type: values.vehicle_details.type,
        make: values.vehicle_details.make || "",
        model: values.vehicle_details.model || "",
        year: values.vehicle_details.year ? Number(values.vehicle_details.year) : undefined,
        registration_number: values.vehicle_details.registration_number || "",
        fuel_type: values.vehicle_details.fuel_type || "petrol",
        claims_past_3_years: values.vehicle_details.claims_past_3_years || false,
      },
    };

    const { data: newClient, error } = await supabase
      .from("clients")
      .insert(payload as any)
      .select("id")
      .single();

    if (error || !newClient) {
      throw new Error(error?.message || "Failed to create client record. Please try again.");
    }

    const created = newClient as { id: string };
    router.push(`/clients/${created.id}`);
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1.5">
            <Link href="/clients" className="hover:text-pine-950 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Clients
            </Link>
            <span>/</span>
            <span className="text-pine-950 font-bold">New Intake</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-tight flex items-center gap-2.5">
            Client Onboarding Dossier
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-lime-400 text-pine-950 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" /> Real-Time Underwriting
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture contact, financial capacity, medical disclosures, and vehicle data to trigger instant policy eligibility
          </p>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Clients
          </Link>
        </Button>
      </div>

      {/* MULTI-SECTION FORM */}
      <ClientForm onSubmit={handleClientSubmit} mode="create" />
    </div>
  );
}
