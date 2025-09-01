import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeftIcon,
  CalendarIcon,
  EditIcon,
  PackageIcon,
  StarIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";

import { prisma } from "@/lib/prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductImageSwitcher from "@/components/admin/product/product-image-switcher";
import BlockNoteRender from "@/components/tools/blocknote-render";

import {
  formatPrice,
  setAverageRating,
  setProductTag,
  setStockStatus,
} from "@/types/admin/product";


async function getProductData({ productId }: { productId: string }) {
  const productPost = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      warehouseId: true,
      brandId: true,
      categoryId: true,
      promotionId: true,
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
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      swatch: {
        select: {
          id: true,
          type: true,
          name: true,
          value: true,
          images: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!productPost) {
    return notFound();
  }

  return productPost;
}

type Params = Promise<{ productId: string }>;

const ProductIdRoutePage = async ({ params }: { params: Params }) => {
  const { productId } = await params;
  const productPost = await getProductData({ productId });

  if (!productPost) {
    return notFound();
  }

  const productFormattedPrice = formatPrice(productPost.price);
  const averageRating = setAverageRating(productPost.reviews);
  const productStockStatus = setStockStatus(
    productPost.stock,
    productPost.status
  );
  const productTag = setProductTag(productPost.tag);

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="view-product"
      className="my-4 space-y-4"
    >
      <div className="my-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{productPost.name}</h1>
            <p className="text-muted-foreground">Product Details</p>
          </div>
          <Button asChild>
            <Link href={`/admin/products/${productPost.id}/update`}>
              <EditIcon />
              Edit Product
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <ProductImageSwitcher images={productPost.images} />
          </div>

          {/* Product Information and Swatches (if you include them) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">
                      {productPost.name}
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      {/* status */}
                      {productStockStatus.label && (
                        <Badge className={`${productStockStatus.color}`}>
                          {productStockStatus.label}
                        </Badge>
                      )}

                      {/* tag */}
                      {productTag.label && (
                        <Badge className={`${productTag.color}`}>
                          <TagIcon className="h-3 w-3 mr-1" />
                          {productTag.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {productFormattedPrice}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <PackageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {productStockStatus.label}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Brand
                      </label>
                      <p className="text-lg">{productPost.brandId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        SKU
                      </label>
                      <p className="font-mono">{productPost.sku}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Category
                      </label>
                      <p>{productPost.categoryId}</p>
                    </div>
                    {productPost.productVariant && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {productPost.productVariant}
                        </label>
                        <p>{productPost.productVariantValue}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Rating
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {averageRating.toFixed(1)} (
                          {productPost.reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Created
                      </label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {productPost.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {productPost.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* swatches */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Product Swatches</CardTitle>
                  <Button asChild>
                    <Link href={`/admin/products/${productPost.id}/swatches`}>
                      Manage Swatches
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {productPost.swatch && productPost.swatch.length === 0 ? (
                  <p className="text-muted-foreground">
                    No swatches added for this product yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productPost.swatch?.map((swatchItem) => (
                      <Card
                        key={swatchItem.id}
                        className="p-4 flex flex-col gap-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{swatchItem.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Value: {swatchItem.value}
                        </p>
                        <Badge variant="secondary">{swatchItem.type}</Badge>
                        {swatchItem.images && swatchItem.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {swatchItem.images.map((imgUrl, idx) => (
                              <Image
                                key={idx}
                                src={imgUrl}
                                alt={`Swatch ${swatchItem.name} Image ${
                                  idx + 1
                                }`}
                                width={60}
                                height={60}
                                className="p-1 rounded-md object-cover border"
                              />
                            ))}
                          </div>
                        )}
                        {/* Edit Swatch Button */}
                        <Button
                          className="absolute top-2 right-2"
                          asChild
                          size={"icon"}
                        >
                          <Link
                            href={`/admin/products/${productPost.id}/swatches/${swatchItem.id}/update`}
                          >
                            <EditIcon />
                          </Link>
                        </Button>

                        <Button
                          className="absolute top-2 left-2"
                          asChild
                          size={"icon"}
                          variant={"destructive"}
                        >
                          <Button asChild variant="destructive" size="icon">
                            <Link
                              href={`/admin/products/${productPost.id}/swatches/${swatchItem.id}/delete`}
                            >
                              <TrashIcon />
                            </Link>
                          </Button>
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="specifications">Specs</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-4">
                    <div className="prose max-w-none">
                      <BlockNoteRender
                        initialContent={productPost.content || "No content"}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="mt-4">
                    <div className="space-y-3">
                      <BlockNoteRender initialContent={productPost.features} />
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="mt-4">
                    <div className="space-y-3">
                      <BlockNoteRender
                        initialContent={
                          productPost.specifications || "No Specifications"
                        }
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="mt-4">
                    <div className="space-y-4">
                      <BlockNoteRender
                        initialContent={productPost.content || "No Content"}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductIdRoutePage;
