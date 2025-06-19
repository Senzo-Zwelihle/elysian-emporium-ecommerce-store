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
  address: {
    id: string;
    fullName: string;
    streetAddress: string;
    streetAddress2: string | null;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };

  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
};

export { OrderStatus, PaymentMethod, PaymentStatus };

export type FormatterFunction = (amount: number | string) => string;
export type DateFormatterFunction = (date: Date) => string;
