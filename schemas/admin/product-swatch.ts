import { z } from "zod";

export const productSwatchZodSchema = z.object({
  type: z.string().min(1, "Swatch type is required."),
  name: z.string().min(1, "Swatch name is required."),
  value: z.string().min(1, "Swatch value is required."),
  images: z.array(z.string().url("Invalid image URL")).optional(),
  status: z.string().min(1, "Swatch Status value is required."),
  productId: z.string().min(1, "Product ID is required for a swatch."),
});
