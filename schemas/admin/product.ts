import { z } from "zod";

export const productZodSchema = z.object({
  name: z
    .string()
    .min(1, "Product  name is required, please provide a valid name."),
  slug: z
    .string()
    .min(1, "Product slug is required, please provide a valid slug."),
  sku: z
    .string()
    .min(
      1,
      "Product Stock Keeping Unit is required, please provide a valid value."
    ),
  brand: z
    .string()
    .min(1, "Product brand is required, please provide a valid brand."),
  price: z.coerce.number().min(0.01, "Price must be > 0"),
  stock: z.coerce
    .number()
    .min(0, "Product Stock Number must be greater than 0"),
  productVariant: z.string().optional(),
  productVariantValue: z.string().optional(),
  category: z.string().min(1, "Product category is required."),
  description: z.string().min(1, "Product description is required."),
  features: z.string().min(1, "Product features is required."),
  specifications: z.string().optional(),
  content: z.string().optional(),
  images: z
    .array(z.string().url("Invalid Product image"))
    .min(1, "At least one image is required"),
  tag: z.string().min(1, "Product Tag is required"),
  status: z.string().min(1, "Product Status is required"),
});
