"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma";
import {
  getZodAdminOrdersSchema,
  updateZodOrderStatusSchema,
  updateZodPaymentSchema,
} from "@/schemas/admin/order";

const ADMIN_EMAIL = process.env.AUTH;

async function checkAdminAuth() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/api/auth/login");
  }
  return user;
}

// fetch all orders
export async function getAdminOrdersAction(
  params: z.infer<typeof getZodAdminOrdersSchema>
) {
  await checkAdminAuth();

  try {
    const validatedParams = getZodAdminOrdersSchema.parse(params);

    const { page, perPage, status, paymentStatus, search, sortBy, sortOrder } =
      validatedParams;

    const currentPage = page ?? 1;
    const itemsPerPage = perPage ?? 10;
    const currentSortBy = sortBy ?? "createdAt";
    const currentSortOrder = sortOrder ?? "desc";
    const skip = (currentPage - 1) * itemsPerPage;
    const take = itemsPerPage;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { firstName: { contains: search, mode: "insensitive" } } },
        { user: { lastName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, totalOrders] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          address: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  slug: true,
                  sku: true,
                  price: true,
                },
              },
            },
          },
        },
        orderBy: { [currentSortBy]: currentSortOrder },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ]);

    // Convert Decimal types to numbers before returning since our product price is Decimal!!
    const ordersForClient = orders.map((order) => ({
      ...order,
      totalAmount: order.totalAmount.toNumber(),
      shippingCost: order.shippingCost.toNumber(),
      vatAmount: order.vatAmount.toNumber(),
      items: order.items.map((item) => ({
        ...item,
        price: item.price.toNumber(),
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
        },
      })),
    }));

    return {
      success: true,
      orders: ordersForClient,
      totalOrders,
      page: currentPage,
      perPage: itemsPerPage,
    };
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input for fetching orders.",
        issues: error.issues,
      };
    }
    return {
      success: false,
      error: "Failed to fetch orders for admin.",
    };
  }
}

// fetch full details
export async function getAdminOrderDetailsAction(orderId: string) {
  await checkAdminAuth();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
                sku: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found.",
      };
    }

    const orderForClient = {
      ...order,
      totalAmount: order.totalAmount.toNumber(),
      shippingCost: order.shippingCost.toNumber(),
      vatAmount: order.vatAmount.toNumber(),
      items: order.items.map((item) => ({
        ...item,
        price: item.price.toNumber(),
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
        },
      })),
    };

    return {
      success: true,
      order: orderForClient,
    };
  } catch (error) {
    console.error("Admin Get Order Details Error:", error);
    return {
      success: false,
      error: "Failed to fetch order details for admin.",
    };
  }
}

// admin update order status
export async function adminUpdateOrderStatusAction(
  orderId: string,
  data: z.infer<typeof updateZodOrderStatusSchema>
) {
  await checkAdminAuth();

  try {
    const validated = updateZodOrderStatusSchema.parse(data);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: validated.status,
        transactionId: validated.transactionId,
        paymentGatewayId: validated.paymentGatewayId,
        cancellationReason: validated.cancellationReason,
        actualDeliveryDate:
          validated.status === OrderStatus.Delivered
            ? new Date()
            : validated.actualDeliveryDate,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    const updatedOrderForClient = {
      ...updatedOrder,
      totalAmount: updatedOrder.totalAmount.toNumber(),
      shippingCost: updatedOrder.shippingCost.toNumber(),
      vatAmount: updatedOrder.vatAmount.toNumber(),
    };

    return {
      success: true,
      order: updatedOrderForClient,
    };
  } catch (error) {
    console.error("Admin Order Status Update Error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input for order status update.",
        issues: error.issues,
      };
    }
    return {
      success: false,
      error: "Failed to update order status.",
    };
  }
}

// admin only update payment status
export async function adminUpdatePaymentStatusAction(
  orderId: string,
  data: z.infer<typeof updateZodPaymentSchema>
) {
  await checkAdminAuth();

  try {
    const validated = updateZodPaymentSchema.parse(data);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: validated.paymentStatus,
        transactionId: validated.transactionId,
        paymentGatewayId: validated.paymentGatewayId,
        status:
          validated.paymentStatus === PaymentStatus.Paid
            ? OrderStatus.Confirmed
            : undefined,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    const updatedOrderForClient = {
      ...updatedOrder,
      totalAmount: updatedOrder.totalAmount.toNumber(),
      shippingCost: updatedOrder.shippingCost.toNumber(),
      vatAmount: updatedOrder.vatAmount.toNumber(),
    };

    return {
      success: true,
      order: updatedOrderForClient,
    };
  } catch (error) {
    console.error("Admin Payment Status Update Error:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input for payment status update.",
        issues: error.issues,
      };
    }
    return {
      success: false,
      error: "Failed to update payment status.",
    };
  }
}

export async function deleteAdminOrderAction(orderId: string) {
  await checkAdminAuth();

  try {
    await prisma.$transaction([
      prisma.orderItem.deleteMany({
        where: { orderId: orderId },
      }),
      prisma.order.delete({
        where: { id: orderId },
      }),
    ]);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return {
      success: true,
      message: "Order and associated items deleted successfully.",
    };
  } catch (error) {
    console.error("Admin Delete Order Error:", error);
    return {
      success: false,
      error: "Failed to delete order.",
    };
  }
}
