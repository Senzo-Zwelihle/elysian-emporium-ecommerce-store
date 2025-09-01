import { z } from "zod";
import { DocumentType, Status } from "@/lib/generated/prisma";

export const documentSchema = z.object({
  name: z.string().max(30, "Document name must be under 30 characters."),
  documentType: z.enum(DocumentType),
  status: z.enum(Status),
  file: z.string().min(1, "Atleast one file required."),
  starred: z.boolean(),
});

export type DocumentSchemaType = z.infer<typeof documentSchema>;
