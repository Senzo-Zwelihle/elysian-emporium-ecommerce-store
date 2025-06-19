"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { Category, Status } from "@/lib/generated/prisma";
import { billboardZodSchema } from "@/schemas/admin/billboard";

// manual auth config
const auth = process.env.AUTH;

// create new collection action
export async function createNewBillboardAction(
  data: z.infer<typeof billboardZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create billboards.",
    };
  }

  try {
    const validated = billboardZodSchema.parse(data);

    await prisma.billboard.create({
      data: {
        label: validated.label,
        description: validated.description,
        image: validated.image,
        url: validated.url,
        category: validated.category as Category,
        state: validated.state as Status,
      },
    });

    return {
      success: true,
      message: "Billboard created successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (createNewBillboardAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating a new billboard.",
    };
  }
}

// edit existing collection action

export async function editBillboardAction(
  billboardId: string,
  data: z.infer<typeof billboardZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit billboards.",
    };
  }

  try {
    const validated = billboardZodSchema.parse(data);

    await prisma.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label: validated.label,
        description: validated.description,
        image: validated.image,
        url: validated.url,
        category: validated.category as Category,
        state: validated.state as Status,
      },
    });

    return {
      success: true,
      message: "Billboard edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editBillboardAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the billboard.",
    };
  }
}

// delete existing billboard action
export async function deleteBillboardAction(billboardId: string) {
  await prisma.billboard.delete({
    where: {
      id: billboardId,
    },
  });

  return redirect("/admin/billboards");
}
