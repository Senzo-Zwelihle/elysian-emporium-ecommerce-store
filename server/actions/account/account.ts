import { prisma } from "@/lib/client/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getCurrentUserId() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.email) {
    throw new Error("User not authenticated or missing email.");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (!dbUser) {
    throw new Error("No user found in the database with this email.");
  }

  return dbUser.id;
}

export async function fetchUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}

export async function fetchUserAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      label: true,
      fullName: true,
      streetAddress: true,
      streetAddress2: true,
      city: true,
      province: true,
      country: true,
      postalCode: true,
      phoneNumber: true,
      isDefault: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return addresses;
}

export async function fetchUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      shippingCost: true,
      vatAmount: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      transactionId: true,
      paymentGatewayId: true,
      customerNotes: true,
      cancellationReason: true,
      expectedDeliveryDate: true,
      actualDeliveryDate: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          productId: true,
          quantity: true,
          price: true,
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stock: true,
            },
          },
        },
      },
    },
  });
  return orders;
}

export async function fetchUserFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          stock: true,
        },
      },
    },
  });
  return favorites;
}

export async function fetchUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      comment: true,
      productId: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          price: true,
          stock: true,
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });
  return reviews;
}
