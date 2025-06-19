import { z } from "zod";

export const reviewZodSchema = z.object({
  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a number",
    })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  
  comment: z
    .string({
      required_error: "Comment is required",
      invalid_type_error: "Comment must be text",
    })
    .trim()
    .min(10, "Comment must be at least 10 characters long")
    .max(500, "Comment must be less than 500 characters"),
});