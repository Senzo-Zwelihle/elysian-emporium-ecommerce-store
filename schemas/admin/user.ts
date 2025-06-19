import { z } from "zod";

export const userZodSchema = z.object({
  email: z
    .string()
    .email("Invalid email address.")
    .min(1, "Email is required."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  profileImage: z
    .string()
    .min(1, "Profile image is required, please upload at least one image."),
  status: z.string().min(1, "User Status is required"),
  role: z.string().min(1, "User Role is required"),
  membership: z.string().min(1, "User Role is required"),
});
