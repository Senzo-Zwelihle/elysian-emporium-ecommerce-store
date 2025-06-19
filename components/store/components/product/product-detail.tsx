"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  formatPrice,
  Product,
  setAverageRating,
  setProductTag,
  setStockStatus,
} from "@/types/store/product";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ProductRating from "./product-rating";
import ProductQuantity from "./product-quantity";
import ProductCartButton from "../cart/product-cart-button";
import FavoriteButton from "../favorite/favorite-button";
import { addNewItemToCartAction } from "@/server/actions/store/cart";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  // product quantity amount states
  const [quantity, setQuantity] = useState(1);

  //   grading and types
  const productAverageRating = setAverageRating(product.review);
  const productFormattedPrice = formatPrice(product.price);
  const productStockStatus = setStockStatus(product.stock, product.status);
  const productTag = setProductTag(product.tag);

  const formAction = async (formData: FormData) => {
    const currentQuantity = quantity;
    const productId = formData.get("productId") as string;

    if (currentQuantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }
    if (currentQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock.`);
      return;
    }

    // Call the Server Cart Action with productId and the currentQuantity state
    const result = await addNewItemToCartAction(productId, currentQuantity);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      className="flex flex-col"
    >
      {/* Product Name */}
      <h1 className="mb-2 scroll-m-20 text-3xl lg:text-4xltracking-tight">
        {product.name}
      </h1>

      <Separator className="mb-4" />
      {/* Category & Tag Badges */}
      <div className="mb-2 flex items-center gap-2">
        <Badge variant="secondary">{product.category}</Badge>
        {productTag.label && (
          <Badge className={`${productTag.color}`}>{productTag.label}</Badge>
        )}
      </div>

      {/* Brand */}
      <p className="mb-4 text-base">
        Brand:
        <span className="font-semibold text-primary"> {product.brand}</span>
      </p>
      {/* Price */}
      <motion.p
        className="mb-4 text-3xl font-[family-name:var(--font-PolySans-Bulky)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
      >
        {productFormattedPrice}
      </motion.p>
      {/* Rating and Stock Status */}
      <div className="mb-4 flex items-center gap-2">
        <ProductRating rating={productAverageRating} />
        <span className="text-sm text-muted-foreground">
          ({product.review.length} reviews)
        </span>
        <Separator orientation="vertical" className="mx-2 h-4" />
        <Badge className={productStockStatus.color}>
          {productStockStatus.label}
        </Badge>
      </div>

      {/* Quantity Selector */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 mb-4 flex items-center gap-2"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          disabled={quantity <= 1 || product.stock === 0}
          className="h-8 w-8 rounded-full md:h-10 md:w-10"
        >
          <MinusIcon />
        </Button>
        <AnimatePresence mode="wait">
          <motion.div
            key={quantity}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-20 md:w-24"
          >
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={product.stock}
              className="w-full text-center"
              disabled={product.stock === 0}
            />
          </motion.div>
        </AnimatePresence>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setQuantity((prev) => Math.min(product.stock, prev + 1))
          }
          disabled={quantity >= product.stock || product.stock === 0}
          className="h-8 w-8 rounded-full md:h-10 md:w-10"
        >
          <PlusIcon />
        </Button>

        <AnimatePresence>
          {product.stock < 10 && product.stock > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="ml-2 text-base text-orange-600 dark:text-orange-400"
            >
              Only {product.stock} left in stock!
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div> */}
      <ProductQuantity
        quantity={quantity}
        setQuantity={setQuantity}
        stock={product.stock}
        onQuantityChange={(newQuantity) => {
          // Handle quantity change
          console.log("New quantity:", newQuantity);
        }}
      />
      {/* end content */}
      <div className="mt-4 flex items-center gap-4">
        <ProductCartButton
          stock={product.stock}
          formAction={formAction}
          productId={product.id}
          className="flex-1"
        />
        {/* add to favorites button */}
        <FavoriteButton
          productId={product.id}
          initialIsFavorited={product.isFavorited ?? false}
        />
      </div>
    </motion.div>
  );
};

export default ProductDetail;
