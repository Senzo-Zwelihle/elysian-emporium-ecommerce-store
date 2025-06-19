import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/client/prisma";
import {
  ProductServer,
  serializeProduct,
} from "@/types/store/product-with-review";
import ProductClient from "@/components/store/components/product/product-client";
import CreateNewReviewForm from "@/components/forms/create/create-review";
import { ReviewList } from "@/components/store/components/review/review-list";

async function fetchProduct({
  productId,
  userId,
}: {
  productId: string;
  userId: string | null;
}): Promise<ProductServer> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      brand: true,
      price: true,
      stock: true,
      productVariant: true,
      productVariantValue: true,
      description: true,
      category: true,
      features: true,
      specifications: true,
      content: true,
      images: true,
      tag: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });

  if (!product) {
    return notFound();
  }

  return product as ProductServer;
}

type StoreParams = Promise<{ id: string }>; // Keeping your exact params type

const StoreProductIdRoutePage = async ({ params }: { params: StoreParams }) => {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { id: productId } = await params;
  const rawProduct = await fetchProduct({
    productId,
    userId: user?.id || null,
  });
  const product = serializeProduct(rawProduct);

  // Calculate average rating and total reviews from the serialized product's reviews
  const totalReviews = product.review.length;
  const averageRating =
    totalReviews > 0
      ? product.review.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  // Check if the current user has already reviewed this product
  const userReview = user
    ? product.review.find((review) => review.user.id === user.id)
    : undefined;

  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <ProductClient product={product} />

      <Separator className="my-10" />

      {/* Reviews Section */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-1 flex items-center justify-center">
    <div className="w-full max-w-md">
      {user ? (
        <CreateNewReviewForm
          productId={product.id}
          userId={user.id}
          existingRating={userReview?.rating}
          existingComment={userReview?.comment}
        />
      ) : (
        <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
          <p className="text-muted-foreground">
            <Link
              href="/api/auth/login"
              className="text-primary hover:underline"
            >
              Log in
            </Link>{" "}
            to write a review.
          </p>
        </div>
      )}
    </div>
  </div>

  <div className="lg:col-span-2">
    <ReviewList
      reviews={product.review.map((review) => ({
        ...review,
        user: {
          ...review.user,
          image: review.user.image ?? null,
        },
      }))}
      averageRating={averageRating}
      totalReviews={totalReviews}
    />
  </div>
</div>

    </Container>
  );
};

export default StoreProductIdRoutePage;
