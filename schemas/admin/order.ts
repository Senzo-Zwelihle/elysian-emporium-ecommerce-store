import { z } from "zod";
import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma";

export const getZodAdminOrdersSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  perPage: z.coerce.number().min(1).max(100).default(10).optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "totalAmount"]).default("createdAt").optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
});

export const updateZodOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
  cancellationReason: z.string().optional().nullable(),
  actualDeliveryDate: z.date().optional().nullable(),
});

export const updateZodPaymentSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
});
