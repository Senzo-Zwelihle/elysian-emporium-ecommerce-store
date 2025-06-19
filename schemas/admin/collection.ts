import { z } from "zod";

export const collectionZodSchema = z.object({
  label: z
    .string()
    .min(1, "Collection  name is required, please provide a valid name."),
  description: z.string().optional(),
  color: z.string().optional(),
  image: z
    .string()
    .min(1, "Collection image is required, please upload atleast one image."),
  url: z.string().optional(),
  category: z
    .string()
    .min(1, "Collection Category is required, please enter a valid category"),
  state: z.string().min(1, "Billboard state is required"),
});
