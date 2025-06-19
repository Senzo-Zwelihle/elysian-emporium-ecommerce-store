"use server";

import { prisma } from "@/lib/client/prisma";
import { redis } from "@/redis/cart/cart-db";
import { ShoppingCart } from "@/types/store/shopping-cart";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


// create/add cart this is store in redis
export async function addNewItemToCartAction(
  productId: string,
  quantity: number //
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    // If user is not authenticated, redirect to home
    redirect("/");
  }

  // Input validation (crucial, even with client-side validation)
  if (typeof quantity !== "number" || quantity <= 0) {
    return { success: false, message: "Invalid quantity provided." };
  }

  try {
    let cart: ShoppingCart | null = await redis.get(`cart-${user.id}`);

    const selectedProduct = await prisma.product.findUnique({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,

        // we first check stock
        stock: true,
      },
      where: {
        id: productId,
      },
    });

    if (!selectedProduct) {
      return { success: false, message: "Product not found." };
    }

    if (selectedProduct.stock < quantity) {
      return {
        success: false,
        message: `Not enough stock. Only ${selectedProduct.stock} available.`,
      };
    }

    let myCart: ShoppingCart = { userId: user.id, items: [] };

    if (cart && cart.items) {
      myCart.items = [...cart.items];
    }

    let itemFound = false;

    // Check if item already in cart
    myCart.items = myCart.items.map((item) => {
      if (item.id === productId) {
        itemFound = true;
        // Validate against product stock again
        const newQuantityInCart = item.quantity + quantity;
        if (newQuantityInCart > selectedProduct.stock) {
          // This case should ideally be prevented by client-side quantity limits
          throw new Error(
            `Cannot add ${quantity} more. Max stock available: ${selectedProduct.stock}. You have ${item.quantity} in cart.`
          );
        }
        return { ...item, quantity: newQuantityInCart };
      }
      return item;
    });

    if (!itemFound) {
      // Add new item if not found
      myCart.items.push({
        id: selectedProduct.id,
        images: selectedProduct.images[0],
        name: selectedProduct.name,
        price: selectedProduct.price.toNumber(),
        // Use the provided quantity directly
        quantity: quantity,
      });
    }

    await redis.set(`cart-${user.id}`, myCart);

    revalidatePath("/", "layout");
    // Revalidate the product page if stock changes
    revalidatePath(`/products/${selectedProduct.id}`);

    return { success: true, message: "Product added to cart successfully!" };
  } catch (error: any) {
    console.error("Server Action Error (addNewItemToCartAction):", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
}

// remove cart item

export async function deleteItemFromCartAction(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required to delete item.",
    };
  }

  const productId = formData.get("productId");

  if (!productId || typeof productId !== "string") {
    return { success: false, message: "Invalid product ID." };
  }

  try {
    let cart: ShoppingCart | null = await redis.get(`cart-${user.id}`);

    if (cart && cart.items) {
      const initialItemCount = cart.items.length;
      const updatedCart: ShoppingCart = {
        userId: user.id,
        items: cart.items.filter((item) => item.id !== productId),
      };

      await redis.set(`cart-${user.id}`, updatedCart);

      if (updatedCart.items.length < initialItemCount) {
        revalidatePath("/cart");
        revalidatePath("/", "layout");
        return { success: true, message: "Item removed from cart!" };
      } else {
        return { success: false, message: "Item not found in cart." };
      }
    } else {
      return { success: false, message: "Your cart is empty." };
    }
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    return { success: false, message: "Failed to remove item from cart." };
  }
}
