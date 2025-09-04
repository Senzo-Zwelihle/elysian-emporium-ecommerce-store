"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { MoveUpRight } from "lucide-react";
import { Promotion } from "@/types/store/promotion";
import { Badge } from "@/components/ui/badge";
import PromotionOverlay from "./promotion-overlay";

interface PromotionGridProps {
  promotions: Promotion[];
}

const PromotionGridWithOverlay = ({ promotions }: PromotionGridProps) => {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handlePromotionClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedPromotion(null);
  };

  if (promotions.length === 0) {
    return (
      <div className="w-full h-96 bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No promotions available</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 overflow-hidden lg:pb-5 pb-2">
        {promotions.map((promotion, index) => {
          let colSpanClass = "sm:col-span-6 col-span-12";
          if (index === 0) {
            colSpanClass = "sm:col-span-5 col-span-12";
          } else if (index === 1) {
            colSpanClass = "sm:col-span-7 col-span-12";
          } else if (index === promotions.length - 2) {
            colSpanClass = "sm:col-span-7 col-span-12";
          } else if (index === promotions.length - 1) {
            colSpanClass = "sm:col-span-5 col-span-12";
          }

          return (
            <motion.article
              key={promotion.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ ease: "easeOut" }}
              viewport={{ once: false }}
              className={`relative ${colSpanClass} group cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePromotionClick(promotion)}
            >
              <div className="w-auto h-full relative overflow-hidden rounded-xl">
                <Image
                  src={promotion.image}
                  alt={promotion.label}
                  height={600}
                  width={1200}
                  className="h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="absolute lg:bottom-2 bottom-0 text-black w-full p-4 flex justify-between items-center">
                <div>
                  <h3 className="lg:text-xl text-sm bg-black text-white rounded-xl p-2 px-4 transition-transform duration-300 group-hover:scale-105">
                    {promotion.label}
                  </h3>
                  <Badge className="mt-1 transition-transform duration-300 group-hover:scale-105">
                    {promotion.brand.name}
                  </Badge>
                </div>
                <div className="lg:w-12 w-10 lg:h-12 h-10 text-white grid place-content-center rounded-full bg-black transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                  <MoveUpRight className="transition-transform duration-300 group-hover:rotate-12" />
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <PromotionOverlay
        promotion={selectedPromotion}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  );
};

export default PromotionGridWithOverlay;