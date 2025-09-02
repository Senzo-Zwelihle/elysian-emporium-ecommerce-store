import { z } from "zod";
import { Role } from "@/lib/generated/prisma";

export const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  role: z.enum(Role),
  phoneNumber: z.string().nullable(),
});

export type EditUserSchemaType = z.infer<typeof editUserSchema>;
