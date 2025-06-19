import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from "@/lib/generated/prisma";

export interface UserProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;

  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressData {
  id: string;
  label: string | null;
  fullName: string;
  streetAddress: string;
  streetAddress2: string | null;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductData {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

export interface OrderItemData {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: ProductData;
}

export interface OrderData {
  id: string;
  orderNumber: string;
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
  items: OrderItemData[];
}

export interface FavoriteData {
  id: string;
  name: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  product: ProductData;
}

export interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  product: Pick<ProductData, "id" | "name" | "images" | "price" | "stock">;
}

export interface UserProfileClientProps {
  user: UserProfileData;
  addresses: AddressData[];
  orders: OrderData[];
  favorites: FavoriteData[];
  reviews: ReviewData[];
}
