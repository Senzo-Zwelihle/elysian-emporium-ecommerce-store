import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/generated/prisma";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
    slug: string;
    sku?: string | null;
  };
};

export type Order = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  shippingCost: number;
  vatAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerNotes: string | null;
  expectedDeliveryDate: Date | null;
  actualDeliveryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  transactionId: string | null;
  paymentGatewayId: string | null;
  items: OrderItem[];
  shipping: {
    id: string;
    fullName: string;
    streetAddress: string;
    streetAddress2: string | null;
    city: string;
    province: string;
    postalCode: string;
    country: string | null;
    phoneNumber: string;
  };

  user?: {
    name: string | null;
    email: string | null;
  };
};

export { OrderStatus, PaymentMethod, PaymentStatus };

export type FormatterFunction = (amount: number | string) => string;
export type DateFormatterFunction = (date: Date) => string;





export const orderStatusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  packed: "bg-indigo-100 text-indigo-800",
  shipped: "bg-orange-100 text-orange-800",
  outfordelivery: "bg-cyan-100 text-cyan-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-800",
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
  partiallyrefunded: "bg-orange-100 text-orange-800",
  authorized: "bg-blue-100 text-blue-800",
};