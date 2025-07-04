"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingBagIcon, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ShoppingCartItemList from "./cart-item-list";
import { ShoppingCartClientProps } from "@/interfaces/store/cart";
import { SparklesIcon } from "@/components/svg/motion/sparkles";
import { productContainerVariants } from "@/utils/animation/motion";
import { zaCurrencyFormat } from "@/utils/shop/currency-format";

const CartClient = ({ items = [] }: ShoppingCartClientProps) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // Free shipping over R500
  const shippingCost = subtotal > 500 ? 0 : 99;
  const totalAmount = subtotal + shippingCost;

  const handleProceedToCheckout = () => {
    router.push("/check-out");
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!items || items.length === 0) {
    return (
      <motion.div
        className="container mx-auto  py-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center py-16 border-dashed border-2">
          <CardContent className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <ShoppingBagIcon className="w-20 h-20 mx-auto mb-6 text-gray-400" />
            </motion.div>
            <motion.h3
              className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your cart is empty
            </motion.h3>
            <motion.p
              className="text-gray-600 dark:text-gray-400 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover amazing products and start shopping!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={() => router.push("/products")} size="lg">
                Start Shopping
                <ArrowRight />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto py-8"
      variants={productContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Shopping Cart
            </h1>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          </div>
          <ShoppingCartItemList items={items} />
        </motion.div>

        {/* Order Summary */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <Card className="sticky top-4 shadow-lg">
            <CardHeader className="">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Gift />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <motion.div
                  className="flex justify-between items-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="">Subtotal</span>
                  <span className="font-semibold text-lg">
                    {isClient ? zaCurrencyFormat(subtotal) : "---"}
                  </span>
                </motion.div>

                <motion.div
                  className="flex justify-between items-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-2">
                    <span>Shipping</span>
                  </div>
                  <span className="font-semibold">
                    {isClient ? (
                      shippingCost === 0 ? (
                        <Badge className="bg-green-600">Free</Badge>
                      ) : (
                        zaCurrencyFormat(shippingCost)
                      )
                    ) : (
                      "---"
                    )}
                  </span>
                </motion.div>

                <AnimatePresence>
                  {subtotal < 500 && shippingCost > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-lg border"
                    >
                      <p className="text-sm text-center">
                        Add{" "}
                        {isClient ? zaCurrencyFormat(500 - subtotal) : "---"}{" "}
                        more for free shipping! 🚚
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator className="my-4" />

              <motion.div
                className="flex justify-between items-center text-xl font-bold p-4 rounded-lg border"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span>Total</span>
                <span>{isClient ? zaCurrencyFormat(totalAmount) : "---"}</span>
              </motion.div>

              <div className="space-y-3 pt-4 flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size={"lg"}
                    className="font-semibold shadow-lg hover:shadow-xl"
                    onClick={handleProceedToCheckout}
                  >
                    Checkout
                    <SparklesIcon />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size={"lg"}
                    variant={"outline"}
                    className="font-semibold shadow-lg hover:shadow-xl"
                  >
                    Continue shopping
                    <ShoppingBagIcon />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CartClient;
