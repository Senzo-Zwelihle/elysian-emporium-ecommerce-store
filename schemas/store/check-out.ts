import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

export type OrderItemToCreate = {
  productId: string;
  quantity: number;
  price: Decimal;
};

// Cart item schema for checkout
export const checkoutItemSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
  images: z.string().url().nullable().optional(),
});

// Checkout 
export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "At least one item is required"),
  addressId: z.string().min(1, "Shipping address is required").optional(),
  paymentMethod: z
    .enum([
      "CashOnDelivery",
      "Mastercard",
      "Mobicred",
      "Ozow",
      "PayFast",
      "PayFlex",
    ])
    .optional(),
  customerNotes: z.string().optional(),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  shippingCost: z.number().min(0, "Shipping cost must be positive"),
  vatAmount: z.number().min(0, "VAT amount must be positive"),
  // subtotal + shippingCost + vatAmount
  totalAmount: z.number().min(0, "Total amount must be positive"),
});

// Order 
export const createOrderSchema = z.object({
  items: z.array(checkoutItemSchema),
  addressId: z.string(),
  paymentMethod: z.enum([
    "CashOnDelivery",
    "Mastercard",
    "Mobicred",
    "Ozow",
    "PayFast",
    "PayFlex",
  ]),
  customerNotes: z.string().optional(),
  totalAmount: z.number().min(0),
  shippingCost: z.number().min(0),
  vatAmount: z.number().min(0),
});

// Update order
export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
  cancellationReason: z.string().optional().nullable(),
  actualDeliveryDate: z.date().optional().nullable(),
});

// Update payment 
export const updatePaymentSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentData = z.infer<typeof updatePaymentSchema>;
