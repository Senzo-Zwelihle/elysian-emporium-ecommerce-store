"use server";

import { z } from "zod";
import { prisma } from "@/lib/client/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";
import {
  checkoutSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentSchema,
} from "@/schemas/store/check-out";
import { Order } from "@/types/store/order";
import { redis } from "@/redis/cart/cart-db";

// this only applies when the total is more than 500
const SHIPPING_RATE = 99.0;

// Get cart from Redis
export async function getCartFromRedis(userId: string) {
  try {
    const cart = await redis.get(`cart-${userId}`);
    return cart;
  } catch (error) {
    console.error("Error fetching cart from Redis:", error);
    return null;
  }
}

// Clear cart from Redis after successful order
export async function clearCartFromRedis(userId: string) {
  try {
    await redis.del(`cart-${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart from Redis:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

// Helper function to calculate order totals
function calculateOrderTotals(
  items: Array<{ quantity: number; price: number }>
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  ); // Conditional shipping cost
  const calculatedShippingCost = subtotal >= 500 ? 0 : SHIPPING_RATE;
  const vatAmount = 0;
  const totalAmount = subtotal + calculatedShippingCost;

  return {
    subtotal,
    vatAmount,
    shippingCost: calculatedShippingCost,
    totalAmount,
  };
}

// Validate cart items and check stock
export async function validateCartItemsAction(
  items: z.infer<typeof checkoutSchema>["items"]
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  try {
    const productIds = items.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        status: true,
      },
    });

    const validationResults = items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return {
          productId: item.id,
          isValid: false,
          error: "Product not found!",
        };
      }

      if (product.stock < item.quantity) {
        return {
          productId: item.id,
          isValid: false,
          error: `Only ${product.stock} items available in stock`,
        };
      }
      // Check if price matches (prevent price manipulation)

      const expectedPrice = Number(product.price);
      if (Math.abs(expectedPrice - item.price) > 0.01) {
        return {
          productId: item.id,
          isValid: false,
          error: "Price mismatch detected",
        };
      }

      return {
        productId: item.id,
        isValid: true,
        product: {
          id: product.id,
          name: product.name,
          price: expectedPrice,
          stock: product.stock,
        },
      };
    });

    const invalidItems = validationResults.filter((result) => !result.isValid);
    if (invalidItems.length > 0) {
      return {
        success: false,
        errors: invalidItems,
      };
    }

    // Pass the  items to calculateOrderTotals for subtotal calculation
    const totals = calculateOrderTotals(items); // Use 'items' here

    return {
      success: true,
      validatedItems: validationResults,
      totals,
    };
  } catch (error) {
    console.error("Cart validation error:", error);
    return {
      success: false,
      error: "Failed to validate cart items",
    };
  }
}

// Create a new order
export async function createOrderAction(
  data: z.infer<typeof createOrderSchema>
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  try {
    // Validate the address belongs to the user
    const validated = createOrderSchema.parse(data);

    const address = await prisma.address.findUnique({
      where: { id: validated.addressId },
    });

    if (!address || address.userId !== user.id) {
      return {
        success: false,
        error: "Invalid shipping address",
      };
    } // Validate cart items first

    const cartValidation = await validateCartItemsAction(validated.items);
    if (!cartValidation.success) {
      return {
        success: false,
        error: "Cart validation failed",
        details: cartValidation.errors || cartValidation.error,
      };
    }

    // Re-calculate totals on the server with the validated items to ensure consistency
    const serverCalculatedTotals = calculateOrderTotals(validated.items);

    // Basic check for client-server total discrepancy
    if (
      Math.abs(serverCalculatedTotals.totalAmount - validated.totalAmount) >
        0.01 ||
      Math.abs(serverCalculatedTotals.shippingCost - validated.shippingCost) >
        0.01 ||
      Math.abs(serverCalculatedTotals.vatAmount - validated.vatAmount) > 0.01
    ) {
      console.warn("Client-side totals differ from server-side calculations!");
    }
    // Create order in a transaction

    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          addressId: validated.addressId,
          totalAmount: new Decimal(serverCalculatedTotals.totalAmount),
          shippingCost: new Decimal(serverCalculatedTotals.shippingCost),
          vatAmount: new Decimal(serverCalculatedTotals.vatAmount),
          paymentMethod: validated.paymentMethod,
          customerNotes: validated.customerNotes,
          status: "Pending",
          paymentStatus: "Pending",
        },
      });
      // Create order items (using 'id' from Redis structure)

      const orderItems = await Promise.all(
        validated.items.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.id,
              quantity: item.quantity,
              price: new Decimal(item.price),
            },
          })
        )
      );
      // Update product stock after sucessfully order purchase

      await Promise.all(
        validated.items.map((item) =>
          tx.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      );

      return {
        ...newOrder,
        items: orderItems,
      };
    });
    // Clear cart from Redis after successful order creation

    await clearCartFromRedis(user.id);

    revalidatePath("/account/orders");
    revalidatePath("/checkout");
    revalidatePath("/account/cart");

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: Number(order.totalAmount),
        status: order.status,
        paymentMethod: order.paymentMethod,
      },
    };
  } catch (error) {
    console.error("Order creation error:", error);
    return {
      success: false,
      error: "Failed to create order",
    };
  }
}

// Update order status
export async function updateOrderStatusAction(
  orderId: string,
  data: z.infer<typeof updateOrderStatusSchema>
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  try {
    const validated = updateOrderStatusSchema.parse(data);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized or order not found",
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: validated.status,
        transactionId: validated.transactionId,
        paymentGatewayId: validated.paymentGatewayId,
        cancellationReason: validated.cancellationReason,
        actualDeliveryDate:
          validated.status === "Delivered" ? new Date() : undefined,
      },
    });

    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);

    return {
      success: true,
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Order status update error:", error);
    return {
      success: false,
      error: "Failed to update order status",
    };
  }
}

// Update payment status
export async function updatePaymentStatusAction(
  orderId: string,
  data: z.infer<typeof updatePaymentSchema>
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  try {
    const validated = updatePaymentSchema.parse(data);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized or order not found",
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: validated.paymentStatus,
        transactionId: validated.transactionId,
        // Auto-confirm order if payment is successful
        paymentGatewayId: validated.paymentGatewayId,
        status:
          validated.paymentStatus === "Paid" && order.status === "Pending"
            ? "Confirmed"
            : order.status,
      },
    });

    revalidatePath("/account/orders");
    revalidatePath(`/account/orders/${orderId}`);

    return {
      success: true,
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Payment status update error:", error);
    return {
      success: false,
      error: "Failed to update payment status",
    };
  }
}

// Get user's orders (no changes needed)
export async function getUserOrdersAction() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/");

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("Get orders error:", error);
    return {
      success: false,
      error: "Failed to fetch orders",
    };
  }
}

// Get single order details (no changes needed)
export async function getOrderDetailsAction(
  orderId: string
): Promise<
  { success: true; order: Order } | { success: false; error: string }
> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    // For a server action, returning a specific error object is generally better
    // than a redirect for data fetching operations, as it allows the client
    return { success: false, error: "Unauthorized: User not authenticated." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
                sku: true,
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      // If order is not found OR doesn't belong to the user due to `userId` in `where`
      return {
        success: false,
        error: "Order not found or unauthorized access.",
      };
    }

    const processedOrder: Order = {
      ...order,
      totalAmount: Number(order.totalAmount),
      shippingCost: Number(order.shippingCost),
      vatAmount: Number(order.vatAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        images: item.product.images || [],
      })),
    };

    return {
      success: true,
      order: processedOrder,
    };
  } catch (error) {
    console.error(`Get order details error for orderId ${orderId}:`, error);

    return {
      success: false,
      error: "Failed to fetch order details due to an internal error.",
    };
  }
}
