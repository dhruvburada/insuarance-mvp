import { z } from "zod";

export const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳", minDigits: 10, maxDigits: 10 },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸", minDigits: 10, maxDigits: 10 },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", minDigits: 10, maxDigits: 11 },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪", minDigits: 9, maxDigits: 9 },
  { code: "+65", country: "Singapore", flag: "🇸🇬", minDigits: 8, maxDigits: 8 },
  { code: "+61", country: "Australia", flag: "🇦🇺", minDigits: 9, maxDigits: 10 },
  { code: "+49", country: "Germany", flag: "🇩🇪", minDigits: 10, maxDigits: 11 },
] as const;

export const clientFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),
  dob: z
    .string()
    .min(1, "Date of Birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Valid Date of Birth is required (YYYY-MM-DD)")
    .refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const m = today.getMonth() - date.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      return age >= 18 && age <= 100;
    }, "Client must be at least 18 years old and under 100 years old to be eligible for insurance"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(100, "Email address is too long"),
  country_code: z.string().default("+91"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^\d+$/, "Phone number must contain digits only"),
  address: z.string().trim().max(200, "Address cannot exceed 200 characters").optional(),
  city: z.string().trim().min(1, "City is required").max(60, "City name is too long"),
  state: z.string().trim().max(60).optional(),
  pincode: z
    .string()
    .trim()
    .min(1, "Postal PIN code is required")
    .max(10, "Postal code is too long"),
  annual_income: z.coerce
    .number({ invalid_type_error: "Annual income must be a valid number" })
    .min(0, "Income cannot be negative")
    .max(1000000000, "Please enter a realistic annual income amount"),
  occupation: z.string().trim().min(1, "Occupation is required").max(100),
  employer_name: z.string().trim().max(100).optional(),
  marital_status: z.enum(["single", "married", "other"]).default("single"),
  is_smoker: z.boolean().default(false),
  alcohol_frequency: z.enum(["none", "occasional", "regular"]).default("none"),
  hazardous_activity: z.boolean().default(false),
  medical_history: z
    .object({
      diabetes: z.boolean().default(false),
      hypertension: z.boolean().default(false),
      heart_disease: z.boolean().default(false),
      cancer: z.boolean().default(false),
      asthma: z.boolean().default(false),
      kidney_liver: z.boolean().default(false),
      surgeries_5yr: z.boolean().default(false),
      notes: z.string().max(500).optional(),
    })
    .default({}),
  vehicle_details: z
    .object({
      type: z.enum(["four_wheeler", "two_wheeler", "commercial", "none"]).default("none"),
      make: z.string().trim().max(50).optional(),
      model: z.string().trim().max(50).optional(),
      year: z.coerce.number().optional(),
      registration_number: z.string().trim().max(20).optional(),
      fuel_type: z.enum(["petrol", "diesel", "electric", "cng", "hybrid"]).default("petrol"),
      claims_past_3_years: z.boolean().default(false),
    })
    .default({}),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
