"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, UserPlus, Shield, HeartPulse, Car } from "lucide-react";

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-pine-950 tracking-tight">
            Client Onboarding Dossier
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture contact, lifestyle, medical, and vehicle criteria to evaluate instant policy matches
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients">← Back</Link>
        </Button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. PERSONAL & CONTACT */}
        <Card>
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-pine-950" />
              1. Personal & Contact Information
            </CardTitle>
            <CardDescription>
              Basic client demographics used for age limits and communication
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Rahul"
              />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Sharma"
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:border-pine-950 focus-visible:ring-2 focus-visible:ring-lime-400/50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="phone">Phone (WhatsApp) *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876543210"
              />
            </div>

            <div>
              <Label htmlFor="client_email">Email Address *</Label>
              <Input
                id="client_email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. FINANCIAL & LIFESTYLE */}
        <Card>
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <Shield className="h-5 w-5 text-pine-950" />
              2. Financial & Lifestyle Underwriting
            </CardTitle>
            <CardDescription>
              Annual income and habits dictate sum assured limits and term rates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annual_income">Annual Income (INR) *</Label>
                <Input
                  id="annual_income"
                  type="number"
                  required
                  min="0"
                  value={formData.annual_income}
                  onChange={(e) => setFormData({ ...formData, annual_income: Number(e.target.value) })}
                  placeholder="800000"
                />
              </div>

              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pine-950 block">Tobacco / Smoking Habit</span>
                <span className="text-xs text-slate-500">Non-smokers qualify for preferential life rates</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_smoker}
                  onChange={(e) => setFormData({ ...formData, is_smoker: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pine-950"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 3. MEDICAL HISTORY */}
        <Card>
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-pine-950" />
              3. Medical History & Critical Illnesses
            </CardTitle>
            <CardDescription>
              Select any diagnosed pre-existing medical conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "has_diabetes", label: "Diabetes" },
              { id: "has_hypertension", label: "Hypertension (BP)" },
              { id: "has_heart_disease", label: "Heart Disease" },
              { id: "has_cancer", label: "Cancer History" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 p-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition select-none"
              >
                <input
                  type="checkbox"
                  checked={(formData as any)[item.id]}
                  onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                  className="h-4 w-4 text-pine-950 rounded border-slate-300 focus:ring-lime-400"
                />
                <span className="text-xs font-semibold text-pine-950">{item.label}</span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* 4. VEHICLE DETAILS */}
        <Card>
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <Car className="h-5 w-5 text-pine-950" />
              4. Vehicle Details (Motor Insurance)
            </CardTitle>
            <CardDescription>
              Details for comprehensive car or two-wheeler auto policies
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_type">Vehicle Classification</Label>
              <select
                id="vehicle_type"
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:border-pine-950 focus-visible:ring-2 focus-visible:ring-lime-400/50"
              >
                <option value="four_wheeler">Four Wheeler (Car / SUV)</option>
                <option value="two_wheeler">Two Wheeler (Bike / Scooter)</option>
                <option value="commercial">Commercial Vehicle</option>
              </select>
            </div>

            <div>
              <Label htmlFor="vehicle_year">Registration Year</Label>
              <Input
                id="vehicle_year"
                type="number"
                value={formData.vehicle_year}
                onChange={(e) => setFormData({ ...formData, vehicle_year: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* SUBMIT BAR */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" asChild>
            <Link href="/clients">Cancel</Link>
          </Button>

          <Button type="submit" variant="lime" disabled={loading}>
            {loading ? "Evaluating Criteria..." : "Save Profile & Match Policies"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
