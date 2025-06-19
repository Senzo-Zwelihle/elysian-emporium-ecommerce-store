"use client";

import React from "react";
import { motion } from "motion/react";
import { Product } from "@/types/store/product";
import ProductCarousel from "./product-carousel";
import ProductDetail from "./product-detail";
import ProductTabs from "./product-tabs";

interface ProductClientProps {
  product: Product;
}

const ProductClient = ({ product }: ProductClientProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto py-6"
    >
      {/* images */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <ProductCarousel images={product.images} productName={product.name} />
        </motion.div>
        {/* product information */}
        <ProductDetail product={product} />
      </div>
      {/* product tabs */}
      <ProductTabs
        description={product.description}
        features={product.features}
        content={product.content}
        specifications={product.specifications}
      />

      {/* review form */}
      {/* <CreateNewReviewForm productId={product.id}/> */}
    </motion.div>
  );
};

export default ProductClient;
