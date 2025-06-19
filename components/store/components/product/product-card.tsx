"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  formatPrice,
  Product,
  setAverageRating,
  setProductTag,
  setStockStatus,
} from "@/types/store/product";
import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  EyeIcon,
  PackageIcon,
  StarIcon,
  ZapIcon,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ product, viewMode = "grid" }: ProductCardProps) => {
  const productAverageRating = setAverageRating(product.review);
  const productFormattedPrice = formatPrice(product.price);
  const productStockStatus = setStockStatus(product.stock, product.status);
  const productTag = setProductTag(product.tag);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-80 aspect-[4/3] md:aspect-square overflow-hidden">
                <Link href={`/product/${product.id}`}>
                  <Image
                    src={
                      product.images[0] ||
                      "/svg/vercel-placeholder.svg?height=400&width=400"
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge variant="secondary">{product.tag}</Badge>
                </div>

                {/* Wishlist Button */}
              </div>

              {/* Content */}
              <div className="flex-1 p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Brand & Category */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{product.brand}</Badge>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>

                  {/* Product Name */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-2xl font-bold leading-tight hover:text-muted-foreground transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Description */}

                  {/* Rating */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
                        >
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(productAverageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </motion.div>
                      ))}
                      <span className="text-sm text-muted-foreground">
                        {productAverageRating.toFixed(1)} (
                        {product.review.length} reviews)
                      </span>
                    </div>
                  </motion.div>

                  {/* Price & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      {productFormattedPrice}
                    </span>
                    <Badge variant="outline">{product.status}</Badge>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    {productStockStatus.label && (
                      <Badge className={`${productStockStatus.color}`}>
                        {productStockStatus.label}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <motion.div
                  className="pt-2 space-y-3 mt-auto w-full"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <Link href={`/product/${product.id}`}>
                    {productStockStatus.isAvailable && (
                      <div className="items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                            >
                              <Button
                                size={"lg"}
                                effect="shineHover"
                                className="w-full transition-all duration-300 "
                              >
                                <EyeIcon />
                                View Product
                              </Button>
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    )}
                  </Link>

                  {!productStockStatus.isAvailable && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button disabled className="w-full rounded-xl">
                        {product.status === "ComingSoon" ? (
                          <>
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Coming Soon
                          </>
                        ) : (
                          <>
                            <PackageIcon className="h-4 w-4 mr-1" />
                            Out of Stock
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group relative overflow-hidden  shadow-sm hover:shadow-2xl transition-all duration-500  h-full flex flex-col">
        <AspectRatio
          ratio={4 / 5}
          className="relative overflow-hidden rounded-t-xl"
        >
          {/* product image */}
          <Link href={`/product/${product.id}`}>
            <motion.div
              className="relative aspect-square overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={
                  product.images[currentImageIndex] ||
                  "/svg/vercel-placeholder.svg?height=400&width=320"
                }
                alt={product.name}
                fill
                quality={95}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
          {/* product badges */}
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <AnimatePresence>
              {product.tag === "New" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Badge className="shadow-lg rounded-full py-1">
                    <ZapIcon className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                {productTag.label && (
                  <Badge className={`${productTag.color}`}>
                    {productTag.label}
                  </Badge>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Image Dots */}
          {product.images.length > 1 && (
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {product.images.slice(0, 4).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-primary" : "bg-white/50"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </AspectRatio>
        {/* content */}
        <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
          {/* Product Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link href={`/product/${product.id}`}>
              <h3 className="text-xl leading-tight line-clamp-2 transition-colors min-h-[2rem]  font-[family-name:var(--font-PolySansBulky)]">
                {product.name}
              </h3>
            </Link>
          </motion.div>
          {/* Brand & Category */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p className="text-sm tracking-wide text-primary">
              {product.brand}
            </p>
            <Badge variant="outline">{product.category}</Badge>
          </motion.div>
          {/* SKU & Variant */}
          <motion.div
            className="flex items-center justify-between text-xs"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <span className="text-muted-foreground">SKU: {product.sku}</span>
            {product.productVariant && (
              <div className="flex items-center gap-1">
                <span>{product.productVariant}</span>
                {product.productVariantValue && (
                  <motion.div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: product.productVariantValue }}
                    title={product.productVariantValue}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </div>
            )}
          </motion.div>

          {/* Rating & Stats */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
                >
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(productAverageRating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
              ))}
              <span className="text-sm text-muted-foreground">
                {productAverageRating.toFixed(1)} ({product.review.length}{" "}
                Reviews)
              </span>
            </div>
          </motion.div>

          {/* Price & Status */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <span className="text-base font-[family-name:var(--font-PolySansBulky)]">
              {productFormattedPrice}
            </span>
            {productStockStatus.label && (
              <Badge className={`${productStockStatus.color}`}>
                {productStockStatus.label}
              </Badge>
            )}
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div
            className="pt-2 space-y-3 mt-auto w-full"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Link href={`/product/${product.id}`}>
              {productStockStatus.isAvailable && (
                <div className="items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Button
                          size={"lg"}
                          effect="shineHover"
                          className="w-full transition-all duration-300 "
                        >
                          <EyeIcon />
                          View Product
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </Link>

            {!productStockStatus.isAvailable && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button disabled className="w-full rounded-xl">
                  {product.status === "ComingSoon" ? (
                    <>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Coming Soon
                    </>
                  ) : (
                    <>
                      <PackageIcon className="h-4 w-4 mr-1" />
                      Out of Stock
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
