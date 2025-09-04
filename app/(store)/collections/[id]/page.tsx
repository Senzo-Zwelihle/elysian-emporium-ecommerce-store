import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

import { prisma } from "@/lib/prisma/client";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/store/product/product-card";

async function fetchCollection({ collectionId }: { collectionId: string }) {
  noStore();

  // First, get the collection details
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
      status: "active",
    },
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      color: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!collection) {
    return notFound();
  }

  // Then get products from the same category as the collection
  const products = await prisma.product.findMany({
    where: {
      categoryId: collection.categoryId,
      status: "active",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      stock: true,
      productVariant: true,
      productVariantValue: true,
      description: true,
      features: true,
      images: true,
      tag: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform products to match the Product type
  const transformedProducts = products.map((product) => {
    const totalReviews = product.reviews.length;
    const averageRating =
      totalReviews > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brand.name,
      price: product.price.toString(),
      stock: product.stock,
      productVariant: product.productVariant || undefined,
      productVariantValue: product.productVariantValue || undefined,
      description: product.description,
      category: product.category.name,
      features: product.features,
      images: product.images,
      tag: product.tag,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      reviews: product.reviews,
      averageRating,
      totalReviews,
    };
  });

  return {
    ...collection,
    products: transformedProducts,
  };
}

type CollectionParams = Promise<{ id: string }>;

const CollectionDetailPage = async ({
  params,
}: {
  params: CollectionParams;
}) => {
  const { id: collectionId } = await params;
  const collection = await fetchCollection({ collectionId });

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="collection-detail"
      className="pt-24 pb-12"
    >
      {/* Collection Header */}
      <div className="relative mb-12">
        <div className="aspect-[16/5] w-full overflow-hidden rounded-lg ">
          {collection.image ? (
            <Image
              src={collection.image}
              alt={collection.label}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          
        </div>

        <div className="absolute bottom-6 left-6">
          <Badge variant="secondary" className="mb-2">
            {collection.category.name}
          </Badge>
          <Heading
            font={"aeonikBold"}
            size={"lg"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"none"}
            className="text-white"
          >
            {collection.label}
          </Heading>
          {collection.description && (
            <p className="text-white/90 max-w-2xl mt-2">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Heading
            font={"aeonikBold"}
            size={"md"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"none"}
          >
            Products in this Collection
          </Heading>
          <span className="text-muted-foreground">
            {collection.products.length} items
          </span>
        </div>

        {collection.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                There are currently no products in this collection.
              </p>
              <Button asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default CollectionDetailPage;
