"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Client } from "@/types/product.types";
import ClientForm from "@/components/forms/client-form";
import { ClientFormValues } from "@/lib/utils/validators";

interface ClientEditViewProps {
  client: Client;
}

export default function ClientEditView({ client }: ClientEditViewProps) {
  const router = useRouter();
  const supabase = createClient();

  const medicalHistory = (client.medical_history as Record<string, any>) || {};
  const vehicleDetails = (client.vehicle_details as Record<string, any>) || {};

  const initialData: Partial<ClientFormValues> = {
    first_name: client.first_name,
    last_name: client.last_name,
    dob: client.dob,
    gender: client.gender as "male" | "female" | "other",
    email: client.email,
    phone: client.phone,
    city: client.city || "",
    pincode: client.pincode || "",
    annual_income: Number(client.annual_income),
    occupation: client.occupation || "",
    is_smoker: client.is_smoker,
    medical_history: {
      diabetes: Boolean(medicalHistory.diabetes),
      hypertension: Boolean(medicalHistory.hypertension),
      heart_disease: Boolean(medicalHistory.heart_disease),
      cancer: Boolean(medicalHistory.cancer),
      asthma: Boolean(medicalHistory.asthma),
      kidney_liver: Boolean(medicalHistory.kidney_liver),
      surgeries_5yr: Boolean(medicalHistory.surgeries_5yr),
      notes: typeof medicalHistory.notes === "string" ? medicalHistory.notes : "",
    },
    vehicle_details: {
      type: vehicleDetails.type || "none",
      make: vehicleDetails.make || "",
      model: vehicleDetails.model || "",
      year: vehicleDetails.year ? Number(vehicleDetails.year) : undefined,
      registration_number: vehicleDetails.registration_number || "",
      fuel_type: vehicleDetails.fuel_type || "petrol",
      claims_past_3_years: Boolean(vehicleDetails.claims_past_3_years),
    },
  };

  const handleEditSubmit = async (values: ClientFormValues) => {
    const updatePayload = {
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
        year: values.vehicle_details.year ? Number(values.vehicle_details.year) : null,
        registration_number: values.vehicle_details.registration_number || "",
        fuel_type: values.vehicle_details.fuel_type || "petrol",
        claims_past_3_years: values.vehicle_details.claims_past_3_years || false,
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await (supabase.from("clients") as any)
      .update(updatePayload)
      .eq("id", client.id);

    if (error) {
      throw new Error(error.message || "Failed to update client dossier.");
    }

    router.push(`/clients/${client.id}`);
    router.refresh();
  };

  return (
    <ClientForm
      clientId={client.id}
      initialData={initialData}
      onSubmit={handleEditSubmit}
      mode="edit"
    />
  );
}
