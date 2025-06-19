import React from "react";
import { Container } from "@/components/ui/container";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/client/prisma";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateNewProductSwatchForm from "@/components/forms/create/create-product-swatch";

async function getProductData({ productId }: { productId: string }) {
  const productPost = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!productPost) {
    return notFound();
  }

  return productPost;
}

// Corrected: SwatchCreatePageParams type is now a Promise
type SwatchCreatePageParams = Promise<{ productId: string }>;

const CreateSwatchRoutePage = async ({
  params,
}: {
  params: SwatchCreatePageParams;
}) => {
  // Await params to resolve the Promise
  const { productId } = await params;

  const productData = await getProductData({ productId });

  if (!productData) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/products/${productId}`}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">
          Add Swatch for '{productData.name}'
        </h1>
      </div>

      <CreateNewProductSwatchForm productId={productData.id} />
    </Container>
  );
};

export default CreateSwatchRoutePage;
