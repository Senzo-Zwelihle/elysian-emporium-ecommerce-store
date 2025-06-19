import { z } from "zod";

export const documentZodSchema = z.object({
  name: z
    .string()
    .min(1, "Document name is required, please provide a valid name."),
  type: z
    .string()
    .min(1, "Document Type  is required, please provide a valid type."),
  state: z
    .string()
    .min(1, "Document state is required, please upload atleast one image."),
  files: z
    .array(z.string().url("Invalid Document format"))
    .min(
      1,
      "Document File is required, please upload atleast one pdf document."
    ),
  images: z
    .array(z.string().url("Invalid Product image"))
    .min(1, "Document image is required, please upload atleast one image."),
  published: z.boolean(),
});
