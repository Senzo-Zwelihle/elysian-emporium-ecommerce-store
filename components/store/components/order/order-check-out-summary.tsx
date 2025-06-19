"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CartItem, CheckoutTotals } from "@/types/store/check-out";
import { zaCurrencyFormat } from "@/utils/shop/currency-format";


interface CheckoutSummaryProps {
  items: CartItem[];
  totals: CheckoutTotals;
}

const OrderCheckOutSummary = ({ items, totals }: CheckoutSummaryProps) => {
 
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <Image
              src={item.images || "/api/placeholder/64/64"}
              alt={item.name}
              width={40}
              height={40}
              quality={95}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>

              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium">
                {zaCurrencyFormat(item.price * item.quantity)}
              </p>

              <p className="text-sm text-muted-foreground">
                {zaCurrencyFormat(item.price)} each
              </p>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{zaCurrencyFormat(totals.subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>VAT (0%)</span> <span>{zaCurrencyFormat(totals.vatAmount)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {totals.shippingCost === 0
              ? "Free"
              : zaCurrencyFormat(totals.shippingCost)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{zaCurrencyFormat(totals.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckOutSummary;
