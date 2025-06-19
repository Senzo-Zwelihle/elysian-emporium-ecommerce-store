import { OrderClient } from "@/components/store/components/order/order-client";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/client/prisma";
import { OrderWithRelations } from "@/types/store/prisma-relations";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const OrdersRoutePage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  let orders: OrderWithRelations[] = [];
  try {
    const fetchedOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        address: {
          select: {
            id: true,
            fullName: true,
            streetAddress: true,
            streetAddress2: true,
            city: true,
            suburb: true,
            province: true,
            country: true,
            postalCode: true,
            phoneNumber: true,
            label: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                images: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    orders = fetchedOrders.map((order) => ({
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
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      expectedDeliveryDate: order.expectedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,
    }));
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
  }
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <OrderClient orders={orders} />
    </Container>
  );
};

export default OrdersRoutePage;
