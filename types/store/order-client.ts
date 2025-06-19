import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma";

export const orderStatusColors: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-purple-100 text-purple-800",
  Packed: "bg-indigo-100 text-indigo-800",
  Shipped: "bg-orange-100 text-orange-800",
  OutForDelivery: "bg-cyan-100 text-cyan-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Returned: "bg-gray-100 text-gray-800",
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Paid: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
  PartiallyRefunded: "bg-orange-100 text-orange-800",
  Authorized: "bg-blue-100 text-blue-800",
};