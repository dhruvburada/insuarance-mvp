"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "male",
    email: "",
    phone: "",
    annual_income: 500000,
    occupation: "Private Sector Employee",
    is_smoker: false,
    city: "Mumbai",
    pincode: "400001",
    has_diabetes: false,
    has_hypertension: false,
    has_heart_disease: false,
    has_cancer: false,
    vehicle_type: "four_wheeler",
    vehicle_make: "Honda",
    vehicle_model: "City",
    vehicle_year: 2022,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErrorMsg("You must be logged in as an agent to create clients");
      setLoading(false);
      return;
    }

    const { data: newClientData, error } = await supabase
      .from("clients")
      .insert({
        agent_id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        dob: formData.dob,
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        annual_income: Number(formData.annual_income),
        occupation: formData.occupation,
        is_smoker: formData.is_smoker,
        city: formData.city,
        pincode: formData.pincode,
        medical_history: {
          diabetes: formData.has_diabetes,
          hypertension: formData.has_hypertension,
          heart_disease: formData.has_heart_disease,
          cancer: formData.has_cancer,
        },
        vehicle_details: {
          type: formData.vehicle_type,
          make: formData.vehicle_make,
          model: formData.vehicle_model,
          year: Number(formData.vehicle_year),
        },
      } as any)
      .select()
      .single();

    if (error || !newClientData) {
      setErrorMsg(error?.message || "Failed to create client");
      setLoading(false);
    } else {
      const newClient = newClientData as any;
      router.push(`/clients/${newClient.id}`);
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Client Onboarding</h1>
          <p className="text-slate-600 text-sm mt-1">
            Fill in client information to evaluate eligibility for Term, Health, and Auto policies
          </p>
        </div>
        <Link href="/clients" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Cancel
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            1. Personal & Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">First Name *</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
                placeholder="Rahul"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Last Name *</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
                placeholder="Sharma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Phone Number (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
                placeholder="rahul@example.com"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            2. Financial & Lifestyle Eligibility Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Annual Income (INR) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: Number(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
                placeholder="600000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_smoker}
                onChange={(e) => setFormData({ ...formData, is_smoker: e.target.checked })}
                className="h-4 w-4 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <span className="text-sm font-medium text-slate-700">Active Smoker / Tobacco User</span>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            3. Medical History & Pre-existing Illnesses
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "has_diabetes", label: "Diabetes" },
              { id: "has_hypertension", label: "Hypertension (BP)" },
              { id: "has_heart_disease", label: "Heart Disease" },
              { id: "has_cancer", label: "Cancer History" },
            ].map((item) => (
              <label key={item.id} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData as any)[item.id]}
                  onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                  className="h-4 w-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <span className="text-xs font-medium text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            4. Vehicle Details (For Motor Insurance)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Vehicle Type</label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
              >
                <option value="four_wheeler">Four Wheeler (Car / SUV)</option>
                <option value="two_wheeler">Two Wheeler (Bike / Scooter)</option>
                <option value="commercial">Commercial Vehicle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Registration Year</label>
              <input
                type="number"
                value={formData.vehicle_year}
                onChange={(e) => setFormData({ ...formData, vehicle_year: Number(e.target.value) })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Link
            href="/clients"
            className="py-2.5 px-4 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Evaluating & Saving..." : "Save Profile & Match Policies →"}
          </button>
        </div>
      </form>
    </div>
  );
}
