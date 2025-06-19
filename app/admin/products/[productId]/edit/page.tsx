import React from "react";
import { Container } from "@/components/ui/container";
import { notFound } from "next/navigation";
import UpdateProductForm from "@/components/forms/update/update-product";
import { prisma } from "@/lib/client/prisma";

async function getProductPost({ productId }: { productId: string }) {
  const productPost = await prisma.product.findUnique({
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
    },
  });

  if (!productPost) {
    return notFound();
  }

  return productPost;
}

type Params = Promise<{ productId: string }>;

const EditProductRoutePage = async ({ params }: { params: Params }) => {
  const { productId } = await params;

  const productPost = await getProductPost({ productId });

  if (!productPost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <UpdateProductForm
        productPost={{
          ...productPost,
          price: Number(productPost.price),
          productVariant: productPost.productVariant ?? "",
          productVariantValue: productPost.productVariantValue ?? "",
          features: Array.isArray(productPost.features)
            ? productPost.features.join(", ")
            : productPost.features ?? "",
          specifications: Array.isArray(productPost.specifications)
            ? productPost.specifications.join(", ")
            : productPost.specifications ?? "",
          content: Array.isArray(productPost.content)
            ? productPost.content.join(", ")
            : productPost.content ?? "",
        }}
      />
    </Container>
  );
};

export default EditProductRoutePage;
