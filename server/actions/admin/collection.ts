"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { Category, Status } from "@/lib/generated/prisma";
import { collectionZodSchema } from "@/schemas/admin/collection";

// manual auth config
const auth = process.env.AUTH;

// create new collection action
export async function createNewCollectionAction(
  data: z.infer<typeof collectionZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create collections.",
    };
  }

  try {
    const validated = collectionZodSchema.parse(data);

    await prisma.collection.create({
      data: {
        label: validated.label,
        description: validated.description,
        color: validated.color,
        image: validated.image,
        url: validated.url,
        category: validated.category as Category,
        state: validated.state as Status,
      },
    });

    return {
      success: true,
      message: "Collection created successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (createNewCollectionAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating a new collection.",
    };
  }
}

// edit existing collection action

export async function editCollectionAction(
  collectionId: string,
  data: z.infer<typeof collectionZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit collections.",
    };
  }

  try {
    const validated = collectionZodSchema.parse(data);

    await prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        label: validated.label,
        description: validated.description,
        color: validated.color,
        image: validated.image,
        url: validated.url,
        category: validated.category as Category,
        state: validated.state as Status,
      },
    });

    return {
      success: true,
      message: "Collection edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editDocumentAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the collection.",
    };
  }
}

// delete existing doc action
export async function deleteCollectionAction(collectionId: string) {
  await prisma.collection.delete({
    where: {
      id: collectionId,
    },
  });

  return redirect("/admin/collections");
}
