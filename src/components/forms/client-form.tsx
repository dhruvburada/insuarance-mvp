"use client";

import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema, type ClientFormValues, COUNTRY_CODES } from "@/lib/utils/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { formatCurrencyINR } from "@/lib/utils/formatters";
import {
  UserPlus,
  Shield,
  HeartPulse,
  Car,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  PhoneCall,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface ClientFormProps {
  initialData?: Partial<ClientFormValues>;
  clientId?: string;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  mode?: "create" | "edit";
}

const MEDICAL_CONDITIONS = [
  { id: "diabetes", label: "Diabetes Mellitus", description: "Type 1 or Type 2" },
  { id: "hypertension", label: "Hypertension (BP)", description: "Blood pressure condition" },
  { id: "heart_disease", label: "Cardiac / Heart", description: "History of heart condition" },
  { id: "cancer", label: "Cancer / Tumor", description: "Past or active oncology diagnosis" },
  { id: "asthma", label: "Asthma / Respiratory", description: "Chronic breathing condition" },
  { id: "kidney_liver", label: "Kidney / Liver", description: "Renal or hepatic disorder" },
  { id: "surgeries_5yr", label: "Recent Surgeries", description: "Hospitalization in last 5 yrs" },
] as const;

export default function ClientForm({
  initialData,
  clientId,
  onSubmit,
  mode = "create",
}: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Extract country code from initial phone if present
  let initialCountryCode = "+91";
  let initialPhoneNumber = initialData?.phone || "";

  if (initialData?.phone) {
    for (const c of COUNTRY_CODES) {
      if (initialData.phone.startsWith(c.code)) {
        initialCountryCode = c.code;
        initialPhoneNumber = initialData.phone.replace(c.code, "").trim();
        break;
      }
    }
  }

  // Calculate 18 years ago date for max DOB restriction
  const maxDateFor18 = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
  }, []);

  const defaultValues: ClientFormValues = {
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    dob: initialData?.dob || "1994-05-15",
    gender: (initialData?.gender as "male" | "female" | "other") || "male",
    email: initialData?.email || "",
    country_code: (initialData?.country_code as string) || initialCountryCode,
    phone: initialPhoneNumber,
    address: initialData?.address || "",
    city: initialData?.city || "Mumbai",
    state: initialData?.state || "Maharashtra",
    pincode: initialData?.pincode || "400001",
    annual_income: initialData?.annual_income ?? 800000,
    occupation: initialData?.occupation || "Software Engineer",
    employer_name: initialData?.employer_name || "",
    marital_status: (initialData?.marital_status as "single" | "married" | "other") || "single",
    is_smoker: initialData?.is_smoker ?? false,
    alcohol_frequency: (initialData?.alcohol_frequency as "none" | "occasional" | "regular") || "none",
    hazardous_activity: initialData?.hazardous_activity ?? false,
    medical_history: {
      diabetes: initialData?.medical_history?.diabetes ?? false,
      hypertension: initialData?.medical_history?.hypertension ?? false,
      heart_disease: initialData?.medical_history?.heart_disease ?? false,
      cancer: initialData?.medical_history?.cancer ?? false,
      asthma: initialData?.medical_history?.asthma ?? false,
      kidney_liver: initialData?.medical_history?.kidney_liver ?? false,
      surgeries_5yr: initialData?.medical_history?.surgeries_5yr ?? false,
      notes: initialData?.medical_history?.notes || "",
    },
    vehicle_details: {
      type: (initialData?.vehicle_details?.type as "four_wheeler" | "two_wheeler" | "commercial" | "none") || "four_wheeler",
      make: initialData?.vehicle_details?.make || "Honda",
      model: initialData?.vehicle_details?.model || "City",
      year: initialData?.vehicle_details?.year ?? 2022,
      registration_number: initialData?.vehicle_details?.registration_number || "",
      fuel_type: (initialData?.vehicle_details?.fuel_type as "petrol" | "diesel" | "electric" | "cng" | "hybrid") || "petrol",
      claims_past_3_years: initialData?.vehicle_details?.claims_past_3_years ?? false,
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
  });

  const watchedDob = watch("dob");
  const watchedIncome = watch("annual_income");
  const watchedIsSmoker = watch("is_smoker");
  const watchedVehicleType = watch("vehicle_details.type");
  const watchedMedical = watch("medical_history");
  const watchedCountryCode = watch("country_code");

  const calculatedAge = useMemo(() => {
    if (!watchedDob) return null;
    const birthDate = new Date(watchedDob);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [watchedDob]);

  const activeMedicalCount = useMemo(() => {
    if (!watchedMedical) return 0;
    return MEDICAL_CONDITIONS.filter(
      (c) => watchedMedical[c.id as keyof typeof watchedMedical] === true
    ).length;
  }, [watchedMedical]);

  const onFormSubmit = async (data: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      // Normalize phone number to include chosen country code if not already prefixed
      let fullPhone = data.phone.trim();
      if (!fullPhone.startsWith("+")) {
        const cleanCode = data.country_code || "+91";
        fullPhone = `${cleanCode}${fullPhone}`;
      }

      await onSubmit({
        ...data,
        phone: fullPhone,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred while saving the dossier.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {formError && (
        <div className="bg-rose-50 border-2 border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Submission Failed</p>
            <p className="text-xs text-rose-700 mt-0.5">{formError}</p>
          </div>
        </div>
      )}

      {/* 1. PERSONAL & DEMOGRAPHIC INFORMATION */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-pine-950 text-lime-400 flex items-center justify-center">
                <UserPlus className="h-4 w-4" />
              </div>
              1. Personal & Contact Dossier
            </CardTitle>
            <Badge variant="secondary">Verified KYC</Badge>
          </div>
          <CardDescription>
            Core client demographics used for age validation and WhatsApp proposal communication
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register("first_name")}
                placeholder="Rahul"
                className={errors.first_name ? "border-rose-400 focus-visible:ring-rose-200" : ""}
              />
              {errors.first_name && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register("last_name")}
                placeholder="Sharma"
                className={errors.last_name ? "border-rose-400 focus-visible:ring-rose-200" : ""}
              />
              {errors.last_name && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DATE OF BIRTH WITH SHADCN DATE PICKER & AGE BADGE */}
            <div>
              <div className="flex items-center justify-between mb-1.5 h-5">
                <Label htmlFor="dob" className="flex items-center gap-1.5 text-xs font-bold text-pine-950">
                  <Calendar className="h-3.5 w-3.5 text-pine-950/80 shrink-0" />
                  <span>Date of Birth *</span>
                </Label>
                {calculatedAge !== null && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border leading-none inline-flex items-center ${
                      calculatedAge >= 18 && calculatedAge <= 65
                        ? "bg-lime-100 text-pine-950 border-lime-300"
                        : calculatedAge > 65 && calculatedAge <= 100
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    {calculatedAge < 18
                      ? `Underage: ${calculatedAge} yrs (Min 18 required)`
                      : `Age: ${calculatedAge} years`}
                  </span>
                )}
              </div>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="dob"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Date of Birth"
                    error={Boolean(errors.dob || (calculatedAge !== null && calculatedAge < 18))}
                  />
                )}
              />
              {errors.dob ? (
                <p className="text-xs text-rose-600 font-semibold mt-1">{errors.dob.message}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Clients must be 18 to 100 years of age to purchase policies
                </p>
              )}
            </div>

            {/* GENDER WITH SHADCN SELECT */}
            <div>
              <div className="flex items-center mb-1.5 h-5">
                <Label htmlFor="gender" className="text-xs font-bold text-pine-950">
                  Gender *
                </Label>
              </div>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="gender" className="h-10 rounded-xl border-slate-200">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-xs text-rose-600 font-semibold mt-1">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* COUNTRY CODE + PHONE NUMBER SELECTOR */}
            <div className="sm:col-span-6">
              <Label htmlFor="phone" className="flex items-center gap-1.5 mb-1.5">
                <PhoneCall className="h-3.5 w-3.5 text-pine-950" /> Phone Number (WhatsApp Active) *
              </Label>
              <div className="flex gap-2">
                <div className="w-[140px] shrink-0">
                  <Controller
                    name="country_code"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger aria-label="Select Country Dial Code">
                          <SelectValue placeholder="+91" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {COUNTRY_CODES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              <span className="flex items-center gap-1.5">
                                <span>{c.flag}</span>
                                <span className="font-mono font-bold">{c.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="9876543210"
                    className={`font-mono ${
                      errors.phone ? "border-rose-400 focus-visible:ring-rose-200" : ""
                    }`}
                  />
                </div>
              </div>
              {errors.phone ? (
                <p className="text-xs text-rose-600 font-semibold mt-1">{errors.phone.message}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Used for delivering instant WhatsApp proposals & payment links
                </p>
              )}
            </div>

            {/* EMAIL ADDRESS */}
            <div className="sm:col-span-6">
              <Label htmlFor="email" className="flex items-center gap-1.5 mb-1.5">
                <Mail className="h-3.5 w-3.5 text-pine-950" /> Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="rahul.sharma@example.com"
                className={errors.email ? "border-rose-400 focus-visible:ring-rose-200" : ""}
              />
              {errors.email ? (
                <p className="text-xs text-rose-600 font-semibold mt-1">{errors.email.message}</p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Receives automated policy activation confirmation
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <Label htmlFor="city" className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-pine-950" /> City *
              </Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="Mumbai"
                className={errors.city ? "border-rose-400 focus-visible:ring-rose-200" : ""}
              />
              {errors.city && (
                <p className="text-xs text-rose-600 font-semibold mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state" className="mb-1.5 block">State</Label>
              <Input id="state" {...register("state")} placeholder="Maharashtra" />
            </div>

            <div>
              <Label htmlFor="pincode" className="mb-1.5 block">Postal / PIN Code *</Label>
              <Input
                id="pincode"
                maxLength={10}
                {...register("pincode")}
                placeholder="400001"
                className={`font-mono ${
                  errors.pincode ? "border-rose-400 focus-visible:ring-rose-200" : ""
                }`}
              />
              {errors.pincode && (
                <p className="text-xs text-rose-600 font-semibold mt-1">{errors.pincode.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. FINANCIAL & EMPLOYMENT PROFILE */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-pine-950 text-lime-400 flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              2. Financial & Underwriting Profile
            </CardTitle>
            <span className="text-xs font-mono font-extrabold text-pine-950 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {formatCurrencyINR(Number(watchedIncome || 0))} / yr
            </span>
          </div>
          <CardDescription>
            Annual income dictates maximum Sum Assured multipliers for Term Life
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="annual_income">Annual Income (INR) *</Label>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  {formatCurrencyINR(Number(watchedIncome || 0))}
                </span>
              </div>
              <Input
                id="annual_income"
                type="number"
                min={0}
                step={50000}
                {...register("annual_income")}
                placeholder="800000"
                className={`font-mono text-base font-bold ${
                  errors.annual_income ? "border-rose-400 focus-visible:ring-rose-200" : ""
                }`}
              />
              {errors.annual_income && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {errors.annual_income.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="occupation" className="mb-1.5 block">Occupation / Profession *</Label>
              <Input
                id="occupation"
                {...register("occupation")}
                placeholder="Software Engineer"
                className={errors.occupation ? "border-rose-400 focus-visible:ring-rose-200" : ""}
              />
              {errors.occupation && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {errors.occupation.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employer_name" className="mb-1.5 block">Employer / Business Name</Label>
              <Input
                id="employer_name"
                {...register("employer_name")}
                placeholder="TCS / Self-Employed"
              />
            </div>

            {/* MARITAL STATUS WITH SHADCN SELECT */}
            <div>
              <Label htmlFor="marital_status" className="mb-1.5 block">Marital Status</Label>
              <Controller
                name="marital_status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="marital_status">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* SMOKER TOGGLE BENTO CARD */}
          <div
            onClick={() => setValue("is_smoker", !watchedIsSmoker)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex items-center justify-between ${
              watchedIsSmoker
                ? "border-amber-400 bg-amber-50/50"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100/80"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-pine-950">
                  Tobacco / Smoking Habit
                </span>
                <Badge variant={watchedIsSmoker ? "warning" : "success"}>
                  {watchedIsSmoker ? "Active User (+Premium Loading)" : "Non-Smoker (Standard Rates)"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {watchedIsSmoker
                  ? "Smoker status incurs standard actuarial mortality loading for term insurance"
                  : "Clean lifestyle qualifies for the lowest premium tier across life & health plans"}
              </p>
            </div>

            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={watchedIsSmoker}
                onChange={(e) => setValue("is_smoker", e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  watchedIsSmoker ? "bg-amber-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ml-0.5 ${
                    watchedIsSmoker ? "translate-x-6" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. MEDICAL HISTORY & CRITICAL ILLNESS UNDERWRITING */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-pine-950 text-lime-400 flex items-center justify-center">
                <HeartPulse className="h-4 w-4" />
              </div>
              3. Medical History & Pre-Existing Conditions
            </CardTitle>
            <Badge variant={activeMedicalCount > 0 ? "warning" : "success"}>
              {activeMedicalCount > 0
                ? `${activeMedicalCount} Disclosed Condition${activeMedicalCount > 1 ? "s" : ""}`
                : "No Pre-Existing Conditions"}
            </Badge>
          </div>
          <CardDescription>
            Disclosed conditions are evaluated deterministically against carrier underwriting rules
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MEDICAL_CONDITIONS.map((cond) => {
              const isChecked = Boolean(
                watchedMedical?.[cond.id as keyof typeof watchedMedical]
              );
              return (
                <div
                  key={cond.id}
                  onClick={() =>
                    setValue(
                      `medical_history.${cond.id as keyof typeof watchedMedical}` as any,
                      !isChecked
                    )
                  }
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none flex items-start gap-3 ${
                    isChecked
                      ? "border-rose-400 bg-rose-50/60"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      setValue(
                        `medical_history.${cond.id as keyof typeof watchedMedical}` as any,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 text-pine-950 focus:ring-lime-400 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-pine-950 block">{cond.label}</span>
                    <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                      {cond.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <Label htmlFor="medical_notes" className="mb-1.5 block">Additional Medical Notes / Surgery Disclosures</Label>
            <textarea
              id="medical_notes"
              rows={2}
              {...register("medical_history.notes")}
              placeholder="E.g., Appendectomy in 2021 with full recovery; annual HbA1c 5.6"
              className="flex w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-900 focus-visible:outline-none focus-visible:border-pine-950 focus-visible:ring-2 focus-visible:ring-lime-400/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. MOTOR & VEHICLE CLASSIFICATION */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-extrabold text-pine-950 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-pine-950 text-lime-400 flex items-center justify-center">
                <Car className="h-4 w-4" />
              </div>
              4. Motor & Vehicle Classification
            </CardTitle>
            <Badge variant="secondary">Motor Insurance Matching</Badge>
          </div>
          <CardDescription>
            Vehicle parameters determine eligibility for Comprehensive Car & Two-Wheeler policies
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* VEHICLE TYPE WITH SHADCN SELECT */}
            <div>
              <Label htmlFor="vehicle_type" className="mb-1.5 block">Vehicle Classification *</Label>
              <Controller
                name="vehicle_details.type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="vehicle_type">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="four_wheeler">Four Wheeler (Car / SUV)</SelectItem>
                      <SelectItem value="two_wheeler">Two Wheeler (Bike / Scooter)</SelectItem>
                      <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                      <SelectItem value="none">No Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {watchedVehicleType !== "none" && (
              <>
                <div>
                  <Label htmlFor="vehicle_make" className="mb-1.5 block">Vehicle Make / Manufacturer</Label>
                  <Input
                    id="vehicle_make"
                    {...register("vehicle_details.make")}
                    placeholder="Honda / Hyundai / Tata"
                  />
                </div>

                <div>
                  <Label htmlFor="vehicle_model" className="mb-1.5 block">Model / Variant</Label>
                  <Input
                    id="vehicle_model"
                    {...register("vehicle_details.model")}
                    placeholder="City ZX / Creta SX"
                  />
                </div>
              </>
            )}
          </div>

          {watchedVehicleType !== "none" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <Label htmlFor="vehicle_year" className="mb-1.5 block">Manufacturing / Reg Year</Label>
                <Input
                  id="vehicle_year"
                  type="number"
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  {...register("vehicle_details.year")}
                  placeholder="2022"
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="vehicle_reg" className="mb-1.5 block">Registration Number</Label>
                <Input
                  id="vehicle_reg"
                  {...register("vehicle_details.registration_number")}
                  placeholder="MH-02-DW-1234"
                  className="font-mono uppercase"
                />
              </div>

              {/* FUEL TYPE WITH SHADCN SELECT */}
              <div>
                <Label htmlFor="fuel_type" className="mb-1.5 block">Fuel Type</Label>
                <Controller
                  name="vehicle_details.fuel_type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="fuel_type">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric (EV)</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUBMISSION ACTION BAR */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-slate-200 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 hidden sm:block" />
          <span className="text-xs text-slate-600 hidden sm:block">
            {mode === "edit"
              ? "Updating dossier will automatically recalculate policy eligibility"
              : "Submitting evaluates deterministic eligibility across all active carrier products"}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button variant="outline" type="button" asChild disabled={isSubmitting}>
            <Link href={clientId ? `/clients/${clientId}` : "/clients"}>Cancel</Link>
          </Button>

          <Button
            type="submit"
            variant="lime"
            disabled={isSubmitting}
            className="min-w-[220px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "edit" ? "Saving Changes..." : "Evaluating Eligibility..."}
              </>
            ) : (
              <>
                {mode === "edit" ? "Update Client Dossier" : "Save Profile & Match Policies"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
