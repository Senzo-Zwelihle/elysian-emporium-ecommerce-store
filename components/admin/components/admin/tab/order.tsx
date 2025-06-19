import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { OrdersTabProps } from "@/types/admin/admin-dashboard";



const OrdersTab = ({ orders }: OrdersTabProps) => {
  return (
    <>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <ShoppingCartIcon size={60} />
          <p className="mt-2">No recent orders found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your most recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.orderNumber.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {order.user.firstName} {order.user.lastName}
                </TableCell>
                <TableCell>R {order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{order.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(order.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default OrdersTab;
