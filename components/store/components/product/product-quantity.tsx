"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number | ((prev: number) => number)) => void;
  stock: number;
  onQuantityChange?: (quantity: number) => void;
  disabled?: boolean;
  className?: string;
}

const ProductQuantity = ({ 
  quantity, 
  setQuantity, 
  stock, 
  onQuantityChange,
  disabled = false,
  className 
}: QuantitySelectorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.max(1, Math.min(stock, value));
    setQuantity(clampedValue);
    onQuantityChange?.(clampedValue);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => {
      const newValue = Math.min(stock, prev + 1);
      onQuantityChange?.(newValue);
      return newValue;
    });
  };

  const decrementQuantity = () => {
    setQuantity((prev) => {
      const newValue = Math.max(1, prev - 1);
      onQuantityChange?.(newValue);
      return newValue;
    });
  };

  const isOutOfStock = stock === 0;
  const isLowStock = stock < 10 && stock > 0;
  const isMaxQuantity = quantity >= stock;
  const isMinQuantity = quantity <= 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn("space-y-4", className)}
    >
      {/* Quantity Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Quantity</span>
          
          {/* Stock Badge */}
          <AnimatePresence>
            {!isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge 
                  variant={isLowStock ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {stock} in stock
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Card 
          className={cn(
            "p-1 transition-all duration-300",
            isHovered && !disabled && "shadow-md ring-1 ring-primary/20",
            disabled && "opacity-50"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center">
            {/* Decrease Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={decrementQuantity}
                disabled={isMinQuantity || disabled || isOutOfStock}
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-200",
                  !isMinQuantity && !disabled && !isOutOfStock && "hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Quantity Display */}
            <div className="flex-1 px-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quantity}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  transition={{ 
                    duration: 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="relative"
                >
                  <Input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min={1}
                    max={stock}
                    className={cn(
                      "text-center border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold text-lg",
                      "w-full h-10"
                    )}
                    disabled={disabled || isOutOfStock}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Increase Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={incrementQuantity}
                disabled={isMaxQuantity || disabled || isOutOfStock}
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-200",
                  !isMaxQuantity && !disabled && !isOutOfStock && "hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-destructive"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Out of stock</span>
          </motion.div>
        )}

        {isLowStock && !isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.1,
              type: "spring",
              stiffness: 200
            }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </motion.div>
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Only {stock} left in stock!
            </span>
          </motion.div>
        )}

        {isMaxQuantity && !isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            Maximum quantity reached
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantity Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-muted-foreground"
      >
        {quantity > 1 && (
          <span>
            {quantity} items selected
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductQuantity;