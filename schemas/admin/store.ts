import { z } from "zod";

export const storeZodSchema = z.object({
  name: z.string().min(1, "Store name is required and cannot be empty."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional()
    .nullable(),
  location: z.string().min(1, "Store location is required."),
  website: z
    .string()
    .url("Must be a valid URL for the store website.")
    .min(1, "Store website is required."),
  socials: z
    .array(z.string().url("Each social link must be a valid URL."))
    .optional(),
  logo: z
    .string()
    .url("Must be a valid URL for the store logo.")
    .min(1, "Store logo is required, please upload at least one image."),
  status: z
    .string()
    .min(1, "Store Status is required it can be Active or Inactive"),
});
