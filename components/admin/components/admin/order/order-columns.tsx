"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { enZA } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma";
import { OrderCurrencyFormatter } from "@/utils/admin/order-currency-format";


export type OrderWithRelations = {
  id: string;
  orderNumber: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  addressId: string;
  address: {
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
    isDefault: boolean;
    label: string | null;
  };
  totalAmount: number;
  shippingCost: number;
  vatAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
  paymentGatewayId: string | null;
  customerNotes: string | null;
  cancellationReason: string | null;
  expectedDeliveryDate: Date | null;
  actualDeliveryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
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
      sku: string;
      price: number;
    };
    createdAt: Date;
    updatedAt: Date;
  }>;
};

export type OrderColumn = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  shippingAddress: string;
};

// Helper function to map the server-side OrderWithRelations to the client-side OrderColumn
export const mapOrderToOrderColumn = (
  order: OrderWithRelations
): OrderColumn => {
  const customerName = `${order.user.firstName} ${order.user.lastName}`;
  const customerEmail = order.user.email;
  const shippingAddress = `${order.address.streetAddress}, ${order.address.city}, ${order.address.province}, ${order.address.postalCode}`;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName,
    customerEmail,
    totalAmount: Number(order.totalAmount),
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: new Date(order.createdAt),
    shippingAddress,
  };
};

// --- END NEW TYPE DEFINITION ---

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Order #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const orderNumber = row.getValue("orderNumber");
      return (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {String(orderNumber).substring(0, 8).toUpperCase()}...
        </Link>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("customerName")}</div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount") as string);
      return <OrderCurrencyFormatter amount={amount} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: OrderStatus = row.getValue("status");
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      switch (status) {
        case OrderStatus.Pending:
          variant = "secondary";
          break;
        case OrderStatus.Delivered:
          variant = "default";
          break;
        case OrderStatus.Cancelled:
        case OrderStatus.Returned:
          variant = "destructive";
          break;
        default:
          variant = "outline";
          break;
      }
      return (
        <Badge variant={variant} className="capitalize">
          {status.replace(/([A-Z])/g, " $1").trim()}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Payment Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const paymentStatus: PaymentStatus = row.getValue("paymentStatus");
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      switch (paymentStatus) {
        case PaymentStatus.Pending:
          variant = "secondary";
          break;
        case PaymentStatus.Paid:
          variant = "default";
          break;
        case PaymentStatus.Failed:
          variant = "destructive";
          break;
        default:
          variant = "outline";
          break;
      }
      return (
        <Badge variant={variant} className="capitalize">
          {paymentStatus.replace(/([A-Z])/g, " $1").trim()}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Order Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return (
        <div className="whitespace-nowrap">
          {format(date, "PPP", { locale: enZA })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>View Order Details</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}/delete`}>Delete</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
