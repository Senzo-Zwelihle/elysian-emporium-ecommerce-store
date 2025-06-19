import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/client/prisma";
import EditProductSwatchForm from "@/components/forms/update/update-product-swatch";

async function getSwatchData({ swatchId }: { swatchId: string }) {
  const swatch = await prisma.productSwatch.findUnique({
    where: {
      id: swatchId,
    },
    select: {
      id: true,
      productId: true,
      status: true,
      type: true,
      name: true,
      value: true,
      images: true,
    },
  });

  if (!swatch) {
    return notFound();
  }

  return swatch;
}

type Params = Promise<{ productId: string; swatchId: string }>;

const EditProductSwatchPage = async ({ params }: { params: Params }) => {
  const { productId, swatchId } = await params;
  const swatchData = await getSwatchData({ swatchId });

  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <div className="my-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/products/${productId}`}>
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              Edit Swatch: {swatchData.name}
            </h1>
            <p className="text-muted-foreground">
              Modify product swatch details
            </p>
          </div>
        </div>
        <EditProductSwatchForm swatchData={swatchData} />
      </div>
    </Container>
  );
};

export default EditProductSwatchPage;
