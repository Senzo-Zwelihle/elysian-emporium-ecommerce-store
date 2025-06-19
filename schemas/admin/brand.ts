import { z } from "zod";

export const brandZodSchema = z.object({
  company: z
    .string()
    .min(1, "Brand Company is required, please provide a valid name."),
  logo: z
    .string()
    .min(1, "Brand logo is required, please upload atleast one image."),
  active: z.boolean(),
});
