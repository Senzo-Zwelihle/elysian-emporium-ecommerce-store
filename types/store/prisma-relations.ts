import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/generated/prisma";

export type UserWithoutSensitiveInfo = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type AddressForOrder = {
  id: string;
  fullName: string;
  streetAddress: string;
  streetAddress2: string | null;
  city: string;
  suburb: string | null;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  label: string | null;
};

export type ProductForOrderItem = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  images: string[];
  price: number;
};

export type OrderItemWithProduct = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: ProductForOrderItem;
};

export type OrderWithRelations = {
  id: string;
  orderNumber: string;
  userId: string;
  user: UserWithoutSensitiveInfo;
  addressId: string;
  address: AddressForOrder;
  items: OrderItemWithProduct[];
  totalAmount: number;
  shippingCost: number;
  vatAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  paymentGatewayId: string | null;
  customerNotes: string | null;
  cancellationReason: string | null;
  expectedDeliveryDate: Date | null;
  actualDeliveryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// Type for the data returned by getAdminOrdersAction
export type GetAdminOrdersResponse = {
  success: boolean;
  orders?: OrderWithRelations[];
  totalOrders?: number;
  page?: number;
  perPage?: number;
  error?: string;
  issues?: any[]; // Zod errors
};

// Type for the data returned by getAdminOrderDetailsAction
export type GetAdminOrderDetailsResponse = {
  success: boolean;
  order?: OrderWithRelations;
  error?: string;
};
