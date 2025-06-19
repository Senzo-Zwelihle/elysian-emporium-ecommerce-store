import React from "react";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface ProductRatingStarsProps {
  rating: number;
  totalStars?: number;
  starClassName?: string;
  containerClassName?: string;
}

const ProductRating = ({
  rating,
  totalStars = 5,
  starClassName = "text-yellow-400",
  containerClassName,
}: ProductRatingStarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <div className={cn("flex items-center", containerClassName)}>
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <StarIcon
            key={index}
            className={cn(
              "h-4 w-4",
              starClassName,
              starNumber <= fullStars
                ? "fill-current"
                : hasHalfStar && starNumber === fullStars + 1
                ? "fill-current opacity-50"
                : "fill-none"
            )}
          />
        );
      })}
    </div>
  );
};

export default ProductRating;
