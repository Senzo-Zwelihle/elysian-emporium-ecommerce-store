import { z } from "zod";

export const noteZodSchema = z.object({
  title: z
    .string()
    .min(1, "Note title is required, please provide a valid name."),
  content: z
    .string()
    .min(1, "Note Content is required, please enter some content"),
  tag: z.string().min(1, "Note Tag is required."),
  status: z.string().min(1, "Note Status is required."),
  action: z.string().min(1, "Note Action is required."),
  published: z.boolean(),
});
