"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckoutTotals,
  PaymentMethodId,
  paymentMethods,
} from "@/types/store/check-out";
import { ShieldCheckIcon, DollarSignIcon } from "lucide-react";
import Image from "next/image";

interface PaymentFormProps {
  selectedPaymentMethod: PaymentMethodId;
  onSelectPaymentMethod: (methodId: PaymentMethodId) => void;
  customerNotes: string;
  onCustomerNotesChange: (notes: string) => void;
  totals: CheckoutTotals;
}

const OrderPaymentForm = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  customerNotes,
  onCustomerNotesChange,
  totals,
}: PaymentFormProps) => {
  const [notesExpanded, setNotesExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const getLogoPath = (methodId: string) => {
    return `/assets/svg/payment/${methodId.toLowerCase()}.svg`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          Select Payment Method
        </h3>

        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={onSelectPaymentMethod}
          className="space-y-4"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-start space-x-3">
              <div>
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="mt-1"
                />
              </div>

              <div className="flex-1">
                <Label htmlFor={method.id} className="cursor-pointer block">
                  <div className="p-4 border rounded-lg hover:border-primary transition-colors relative overflow-hidden">
                    {/* Animated background for selected */}
                    <AnimatePresence>
                      {selectedPaymentMethod === method.id && (
                        <div className="absolute inset-0 bg-primary/5 rounded-lg" />
                      )}
                    </AnimatePresence>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between space-x-3 mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 relative flex items-center justify-center rounded  shadow-sm">
                            <Image
                              src={getLogoPath(method.id)}
                              alt={`${method.name} logo`}
                              width={40}
                              height={24}
                              className="object-contain"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML =
                                    '<span class="text-lg">💳</span>';
                                }
                              }}
                            />
                          </div>

                          <span className="font-medium">{method.name}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {method.id === "cashondelivery" && (
                            <div>
                              <Badge variant="outline" className="text-xs">
                                <DollarSignIcon className="w-3 h-3 mr-1" />
                                Cash
                              </Badge>
                            </div>
                          )}

                          <AnimatePresence>
                            {selectedPaymentMethod === method.id && (
                              <div>
                                <Badge className="bg-primary text-primary-foreground">
                                  <ShieldCheckIcon className="w-3 h-3 mr-1" />
                                  Selected
                                </Badge>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <div>
          <Label
            htmlFor="customerNotes"
            className="text-base font-semibold flex items-center cursor-pointer"
            onClick={() => setNotesExpanded(!notesExpanded)}
          >
            <span>Special Instructions (Optional)</span>
          </Label>

          <div>
            <Textarea
              id="customerNotes"
              placeholder="Any special delivery instructions or notes for your order..."
              value={customerNotes}
              onChange={(e) => onCustomerNotesChange(e.target.value)}
              className="mt-2 transition-all duration-300 focus:scale-[1.02]"
              rows={3}
              onFocus={() => setNotesExpanded(true)}
            />
          </div>
        </div>
      </div>

      <div className="bg-muted/40 p-4 rounded-lg border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/30 via-green-500/60 to-green-500/30" />

        <h4 className="font-semibold mb-2 flex items-center">Order Summary</h4>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>VAT (0%)</span>
            <span>{formatCurrency(totals.vatAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {totals.shippingCost === 0
                ? "Free"
                : formatCurrency(totals.shippingCost)}
            </span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between font-semibold text-base text-foreground">
            <span>Total</span>
            <span>{formatCurrency(totals.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentForm;
