import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ProductServer, serializeProducts } from "@/types/store/product";
import { prisma } from "@/lib/client/prisma";
import ProductContainer from "../../product/product-container";

async function fetchFeaturedProducts(): Promise<ProductServer[]> {
  const products = await prisma.product.findMany({
    where: {
      status: "Featured",
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
          rating: true,
        },
      },
      favorites: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return products;
}

const Featured = async () => {
  noStore();
  const rawProducts = await fetchFeaturedProducts();
  // neon is returning decimal so we're serializing the decimal to string
  const products = serializeProducts(rawProducts);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} id="featured">
      <Heading
        size={"md"}
        font={"PolySansMedian"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        Featured
      </Heading>

      <ProductContainer initialProducts={products} />
    </Container>
  );
};

export default Featured;
