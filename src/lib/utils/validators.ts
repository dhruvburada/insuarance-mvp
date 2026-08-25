import { z } from "zod";

export const clientFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid Date of Birth is required (YYYY-MM-DD)"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required"),
  annual_income: z.coerce.number().min(0, "Income must be a positive number"),
  occupation: z.string().optional(),
  is_smoker: z.boolean().default(false),
  city: z.string().optional(),
  pincode: z.string().optional(),
  medical_history: z.record(z.boolean()).default({}),
  vehicle_details: z.object({
    type: z.enum(["two_wheeler", "four_wheeler", "commercial"]).optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.coerce.number().optional(),
  }).default({}),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
