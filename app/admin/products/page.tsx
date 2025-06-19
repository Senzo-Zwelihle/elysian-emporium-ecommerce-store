import React from "react";
import Link from "next/link";
import { FilePlus2Icon, BoxesIcon } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/client/prisma";
import { ProductServer, serializeProducts } from "@/types/admin/product";
import ProductGrid from "@/components/admin/components/product/product-grid";

async function fetchProducts(): Promise<ProductServer[]> {
  const products = await prisma.product.findMany({
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
  });

  return products;
}

const ProductsRoutePage = async () => {
  noStore();
  const rawProducts = await fetchProducts();
  // neon is returning decimal so we're serializing the decimal to string
  const products = serializeProducts(rawProducts);

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansBulky"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Products
        </Heading>
        <Button
          effect="expandIcon"
          icon={FilePlus2Icon}
          iconPlacement="right"
          size={"store"}
        >
          <Link href={"/admin/products/create-new"}>Create Product</Link>
        </Button>
      </div>

      {/* notes data */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading
            size={"sm"}
            font={"PolySansSlim"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"md"}
          >
            No Products Found!...
          </Heading>
          <BoxesIcon size={80} />
        </div>
      ) : (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 my-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.filter((p) => p.status === "Active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products.filter((p) => p.stock < 10).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <ProductGrid products={products} />
        </div>
      )}
    </Container>
  );
};

export default ProductsRoutePage;
