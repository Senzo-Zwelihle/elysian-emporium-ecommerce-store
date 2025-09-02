"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ShoppingBagIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Billboard } from "@/types/store/billboard";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/store";

interface BillboardCarouselProps {
  billboards: Billboard[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const BillboardCarousel = ({
  billboards,
  autoPlay = true,
  autoPlayInterval = 5000,
}: BillboardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle auto-play
  useEffect(() => {
    if (!autoPlay || billboards.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === billboards.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, billboards.length]);

  // Handle manual navigation
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? billboards.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === billboards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Reset interval on user interaction
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (autoPlay && billboards.length > 1) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) =>
          prevIndex === billboards.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
    }
  };

  if (billboards.length === 0) {
    return (
      <div className="w-full h-96 bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No billboards available</p>
      </div>
    );
  }

  const currentBillboard = billboards[currentIndex];

  // Slide variants for animation
  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut" as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
      {/* Carousel Container */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentBillboard.image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-2xl text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Badge className="mb-4">
                      {currentBillboard.category.name}
                    </Badge>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {currentBillboard.label}
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {currentBillboard.description}
                  </motion.p>

                  {/* Featured Product */}
                  {currentBillboard.featuredProduct && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="mb-8 p-4 bg-white/10  dark:bg-black/20 backdrop-blur-sm rounded-xl max-w-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/60 dark:bg-black/60">
                          {currentBillboard.featuredProduct.images?.[0] ? (
                            <img
                              src={currentBillboard.featuredProduct.images[0]}
                              alt={currentBillboard.featuredProduct.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">
                            {currentBillboard.featuredProduct.brand.name}
                          </p>
                          <p className="text-white font-medium">
                            {currentBillboard.featuredProduct.name}
                          </p>
                          <p className="text-white font-bold">
                            {formatPrice(
                              currentBillboard.featuredProduct.price
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link href={`/category/${currentBillboard.category.id}`}>
                      <Button
                        effect="expandIcon"
                        icon={ShoppingBagIcon}
                        iconPlacement="left"
                        size="lg"
                        className="transition-all duration-300 transform hover:scale-105"
                        onClick={resetInterval}
                      >
                        Shop Now
                      </Button>
                    </Link>

                    {currentBillboard.featuredProduct && (
                      <Link
                        href={`/product/${currentBillboard.featuredProduct.id}`}
                      >
                        <Button
                        effect="expandIcon"
                        icon={EyeIcon}
                        iconPlacement="left"
                          variant="outline"
                          size="lg"
                          className="transition-all duration-300 transform hover:scale-105"
                          onClick={resetInterval}
                        >
                          View Product
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {billboards.length > 1 && (
        <>
          <button
            onClick={() => {
              goToPrevious();
              resetInterval();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => {
              goToNext();
              resetInterval();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {billboards.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {billboards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index);
                resetInterval();
              }}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BillboardCarousel;
