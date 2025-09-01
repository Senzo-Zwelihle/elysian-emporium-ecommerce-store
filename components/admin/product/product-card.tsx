import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  formatPrice,
  Product,
  setAverageRating,
  setProductTag,
  setStockStatus,
} from "@/types/admin/product";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Package,
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const productAverageRating = setAverageRating(product.reviews);
  const productFormattedPrice = formatPrice(product.price);
  const productStockStatus = setStockStatus(product.stock, product.status);
  const productTag = setProductTag(product.tag);
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={
              product.images[0] ||
              "/svg/vercel-placeholder.svg?height=300&width=300"
            }
            alt={product.name}
            fill
            quality={95}
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Stock status badge */}
          <div className="absolute top-2 left-2">
            {productStockStatus.label && (
              <Badge className={`${productStockStatus.color}`}>
                {productStockStatus.label}
              </Badge>
            )}
          </div>

         

          {/* Product tag badge */}
          <div className="absolute bottom-2 left-2">
            {productTag.label && (
              <Badge className={`${productTag.color}`}>
                {productTag.label}
              </Badge>
            )}
          </div>

          {/* Dropdown menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    <EyeIcon  />
                    View Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/products/${product.id}/update`}>
                    <EditIcon  />
                    Edit Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-red-600">
                  <Link href={`/admin/products/${product.id}/delete`}>
                    <TrashIcon />
                    Delete Product
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {product.name}
              </h3>
              <p className="font-semibold text-sm ">Brand: {product.brand.name}</p>
            </div>
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(productAverageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviews.length})
            </span>
          </div>

          {/* Price and stock */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{productFormattedPrice}</div>

            {productStockStatus.label && (
              <Badge className={`${productStockStatus.color}`}>
                <Package className="mr-1 h-4 w-4" />
                {productStockStatus.label}
              </Badge>
            )}
          </div>

          {/* SKU and stock label */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">SKU: {product.sku}</span>
          </div>

          {/* Variant */}
          {product.productVariant && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.productVariant}: {product.productVariantValue}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/admin/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
