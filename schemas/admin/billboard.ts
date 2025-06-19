import { z } from "zod";

export const billboardZodSchema = z.object({
  label: z
    .string()
    .min(1, "Billboard label is required, please provide a valid name."),
  description: z.string().optional(),
  image: z
    .string()
    .min(1, "Billboard image is required, please upload atleast one image."),
  url: z.string().optional(),
  category: z
    .string()
    .min(1, "Billboard Category is required, please enter a valid category"),
  state: z.string().min(1, "Billboard state is required"),
});
