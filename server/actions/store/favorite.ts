"use server";

import { prisma } from "@/lib/client/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export async function addNewFavoriteItemAction(
  productId: string
): Promise<{ success: boolean; message: string; isFavorited: boolean }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required to favorite items.",
      isFavorited: false,
    };
  }

  try {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });

    let actionMessage: string;
    let newFavoriteStatus: boolean;
    let productSlug: string | undefined;

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      actionMessage = "Removed from favorites!";
      newFavoriteStatus = false;
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { name: true, slug: true },
      });

      if (!product) {
        return {
          success: false,
          message: "Product not found.",
          isFavorited: false,
        };
      }

      await prisma.favorite.create({
        data: {
          name: product.name,
          userId: user.id,
          productId,
        },
      });
      actionMessage = "Added to favorites!";
      newFavoriteStatus = true;
      productSlug = product.slug;
    }

    const revalidateProductPath = productSlug
      ? `/products/${productSlug}`
      : `/products`;

    revalidatePath(revalidateProductPath);
    revalidatePath("/favorites");
    revalidatePath("/", "layout");

    return {
      success: true,
      message: actionMessage,
      isFavorited: newFavoriteStatus,
    };
  } catch (error) {
    console.error("Server Action Error (addNewFavoriteItemAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
      isFavorited: false,
    };
  }
}

// delete fav item
export async function deleteFavoriteAction(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return { success: false, message: "Authentication required." };
  }

  const favoriteId = formData.get("favoriteId");

  if (!favoriteId || typeof favoriteId !== "string") {
    return { success: false, message: "Invalid favorite ID." };
  }

  try {
    const deletedFavorite = await prisma.favorite.delete({
      where: {
        id: favoriteId,
        // Ensure user can only delete their own favorites
        userId: user.id,
      },
    });

    // Revalidate paths after deletion
    revalidatePath("/favorites");
    revalidatePath(`/products/${deletedFavorite.productId}`);
    revalidatePath("/", "layout");

    return { success: true, message: "Item removed from favorites!" };
  } catch (error) {
    console.error("Error deleting favorite:", error);

    return { success: false, message: "Failed to remove item from favorites." };
  }
}
