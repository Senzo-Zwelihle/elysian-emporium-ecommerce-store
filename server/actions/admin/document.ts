"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { DocumentStatus, DocumentType } from "@/lib/generated/prisma";
import { documentZodSchema } from "@/schemas/admin/document";

// manual auth config
const auth = process.env.AUTH;

// create new doc action
export async function createNewDocumentAction(
  data: z.infer<typeof documentZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create documents.",
    };
  }

  try {
    const validated = documentZodSchema.parse(data);

    await prisma.document.create({
      data: {
        name: validated.name,
        type: validated.type as DocumentType,
        state: validated.state as DocumentStatus,
        files: Array.isArray(validated.files)
          ? validated.files
          : [validated.files],
        images: Array.isArray(validated.images)
          ? validated.images
          : [validated.images],
        published: validated.published === true ? true : false,
        //   attaching the user to a document
        user: {
          connect: {
            email: user.email,
          },
        },
      },
    });

    return {
      success: true,
      message: "Document created successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (createNewDocumentAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating a new document.",
    };
  }
}

// edit existing doc action

export async function editDocumentAction(
  documentId: string,
  data: z.infer<typeof documentZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit documents.",
    };
  }

  try {
    const validated = documentZodSchema.parse(data);

    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        name: validated.name,
        type: validated.type as DocumentType,
        state: validated.state as DocumentStatus,
        files: Array.isArray(validated.files)
          ? validated.files
          : [validated.files],
        images: Array.isArray(validated.images)
          ? validated.images
          : [validated.images],
        published: validated.published === true ? true : false,
        //   attaching the user to a document
        user: {
          connect: {
            email: user.email,
          },
        },
      },
    });

    return {
      success: true,
      message: "Document edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editDocumentAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the document.",
    };
  }
}

// delete existing doc action
export async function deleteDocumentAction(documentId: string) {
  await prisma.document.delete({
    where: {
      id: documentId,
    },
  });

  return redirect("/admin/documents");
}
