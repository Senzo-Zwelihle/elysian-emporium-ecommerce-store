import React from "react";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/client/prisma";
import { OrderWithRelations } from "@/types/store/prisma-relations";
import Link from "next/link";
import { OrderDetailsPageContent } from "@/components/store/components/order/order-details-content";

async function getOrderData({
  orderId,
}: {
  orderId: string;
}): Promise<OrderWithRelations> {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
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
  });

  if (!order) {
    return notFound();
  }

  // Convert Decimal types from Prisma to number for client-side usage
  return {
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
  };
}

// Changed to match the pattern from your billboard example
type OrderDetailsPageParams = Promise<{ orderId: string }>;

const OrderDetailsPage = async ({
  params,
}: {
  params: OrderDetailsPageParams;
}) => {
  // Await params as it's now typed as a Promise
  const { orderId } = await params;
  const order = await getOrderData({ orderId });

  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <div className="flex items-center gap-4 mb-6 md:mb-8 my-6">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="shadow-sm hover:scale-105 transition-transform"
        >
          <Link href={"/orders"}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
      </div>

      <OrderDetailsPageContent order={order} />
    </Container>
  );
};

export default OrderDetailsPage;
