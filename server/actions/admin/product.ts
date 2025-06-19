"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { Category, ProductStatus, ProductTag } from "@/lib/generated/prisma";
import { productZodSchema } from "@/schemas/admin/product";

// manual auth config
const auth = process.env.AUTH;

// create new collection action
export async function createNewProductAction(
  data: z.infer<typeof productZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create products.",
    };
  }

  try {
    const validated = productZodSchema.parse(data);

    await prisma.product.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        sku: validated.sku,
        brand: validated.brand,
        price: validated.price,
        stock: validated.stock,
        productVariant: validated.productVariant,
        productVariantValue: validated.productVariantValue,
        category: validated.category as Category,
        description: validated.description,
        features: validated.features,
        specifications: validated.specifications,
        content: validated.content,
        images: validated.images,
        tag: validated.tag as ProductTag,
        status: validated.status as ProductStatus,
      },
    });

    return {
      success: true,
      message: "Product created successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (createNewProductAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating a new product.",
    };
  }
}

// edit existing collection action

export async function editProductAction(
  productId: string,
  data: z.infer<typeof productZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit products.",
    };
  }

  try {
    const validated = productZodSchema.parse(data);

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: validated.name,
        slug: validated.slug,
        sku: validated.sku,
        brand: validated.brand,
        price: validated.price,
        stock: validated.stock,
        productVariant: validated.productVariant,
        productVariantValue: validated.productVariantValue,
        category: validated.category as Category,
        description: validated.description,
        features: validated.features,
        specifications: validated.specifications,
        content: validated.content,
        images: validated.images,
        tag: validated.tag as ProductTag,
        status: validated.status as ProductStatus,
      },
    });

    return {
      success: true,
      message: "Product edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editProductAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the product.",
    };
  }
}

// delete existing doc action
export async function deleteProductAction(productId: string) {
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  return redirect("/admin/products");
}
