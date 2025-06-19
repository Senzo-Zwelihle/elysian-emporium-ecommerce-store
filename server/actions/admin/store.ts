"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { StoreStatus } from "@/lib/generated/prisma";
import { storeZodSchema } from "@/schemas/admin/store";

// Manual auth config
const auth = process.env.AUTH;

// Create new store action
export async function createNewStoreAction(
  data: z.infer<typeof storeZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create stores.",
    };
  }

  try {
    const validated = storeZodSchema.parse(data);

    await prisma.store.create({
      data: {
        name: validated.name,
        description: validated.description,
        location: validated.location,
        website: validated.website,
        socials: validated.socials || [],
        logo: validated.logo,
        status: validated.status as StoreStatus,
      },
    });

    return {
      success: true,
      message: "Store created successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (createNewStoreAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating a new store.",
    };
  }
}

// Edit existing store action
export async function editStoreAction(
  storeId: string,
  data: z.infer<typeof storeZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit stores.",
    };
  }

  try {
    const validated = storeZodSchema.parse(data);

    await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        name: validated.name,
        description: validated.description,
        location: validated.location,
        website: validated.website,
        socials: validated.socials || [],
        logo: validated.logo,
        status: validated.status as StoreStatus,
      },
    });

    return {
      success: true,
      message: "Store edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editStoreAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the store.",
    };
  }
}

// Delete store action
export async function deleteStoreAction(storeId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    throw new Error("Unauthorized. Only admins can delete stores.");
  }

  await prisma.store.delete({
    where: {
      id: storeId,
    },
  });

  return redirect("/admin/stores");
}
