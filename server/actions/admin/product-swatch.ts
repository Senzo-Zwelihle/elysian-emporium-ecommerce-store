// src/server/actions/admin/swatch.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { ProductStatus, ProductSwatchType } from "@/lib/generated/prisma";
import { productSwatchZodSchema } from "@/schemas/admin/product-swatch";

// manual auth config
const auth = process.env.AUTH;

export async function createNewSwatchAction(
  data: z.infer<typeof productSwatchZodSchema>
): Promise<{ success: boolean; message: string; swatchId?: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create swatches.",
    };
  }

  try {
    const validated = productSwatchZodSchema.parse(data);

    const newSwatch = await prisma.productSwatch.create({
      data: {
        type: validated.type as ProductSwatchType,
        name: validated.name,
        value: validated.value,
        images: validated.images || [],
        status: validated.status as ProductStatus,
        productId: validated.productId,
      },
    });

    return {
      success: true,
      message: "Swatch created successfully.",
      swatchId: newSwatch.id,
    };
  } catch (error) {
    console.error("Server Action Error (createNewSwatchAction):", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message:
          "Validation failed: " + error.errors.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred while creating a new swatch.",
    };
  }
}

export async function editSwatchAction(
  swatchId: string,
  data: z.infer<typeof productSwatchZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit swatches.",
    };
  }

  try {
    const validated = productSwatchZodSchema.parse(data);

    await prisma.productSwatch.update({
      where: {
        id: swatchId,
      },
      data: {
        type: validated.type as ProductSwatchType,
        name: validated.name,
        value: validated.value,
        images: validated.images || [],
        status: validated.status as ProductStatus,
        productId: validated.productId,
      },
    });

    return {
      success: true,
      message: "Swatch edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editSwatchAction):", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message:
          "Validation failed: " + error.errors.map((e) => e.message).join(", "),
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred while updating the swatch.",
    };
  }
}

export async function deleteSwatchAction(swatchId: string, productId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can delete swatches.",
    };
  }

  try {
    await prisma.productSwatch.delete({
      where: {
        id: swatchId,
      },
    });

    return redirect(`/admin/products/${productId}/swatches`);
  } catch (error) {
    console.error("Server Action Error (deleteSwatchAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while deleting the swatch.",
    };
  }
}
