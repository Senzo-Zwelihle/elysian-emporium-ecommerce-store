import { z } from "zod";

export const addressZodSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  streetAddress: z.string().min(1, "Address Line 1 is required."),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  suburb: z.string().min(1, "Suburb is required."),
  province: z.string().min(1, "Province is required."),
  country: z.string().min(1, "Country is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  isDefault: z.boolean(),
  label: z.string().nullable().optional(),
});
