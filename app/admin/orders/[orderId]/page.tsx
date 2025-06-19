import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { enZA } from "date-fns/locale";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateOrderForm from "@/components/admin/components/forms/update/update-order";
import UpdatePaymentForm from "@/components/admin/components/forms/update/update-payment";
import { getAdminOrderDetailsAction } from "@/server/actions/admin/order";
import { OrderCurrencyFormatter } from "@/utils/admin/order-currency-format";


async function getOrderData({ orderId }: { orderId: string }) {
  noStore();
  const result = await getAdminOrderDetailsAction(orderId);

  if (!result.success || !result.order) {
    return notFound();
  }

  return result.order;
}

type Params = Promise<{ orderId: string }>;

const AdminOrderDetailsPage = async ({ params }: { params: Params }) => {
  const { orderId } = await params;
  const order = await getOrderData({ orderId });
  const formattedOrderDate = format(order.createdAt, "PPP p", { locale: enZA });

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <div className="flex items-center gap-4 mb-6 md:mb-8 my-6">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="shadow-sm hover:scale-105 transition-transform"
        >
          <Link href={"/admin/orders"}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <Heading
          size={"md"}
          font={"PolySansMedian"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Order Details: #{order.orderNumber.substring(0, 8).toUpperCase()}
        </Heading>
      </div>
      <p className="text-muted-foreground text-sm">Order ID: {order.id}</p>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Order Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Order Date:</strong> {formattedOrderDate}
            </p>
            <p>
              <strong>Total Items:</strong> {order.items.length}
            </p>
            <p>
              <strong>Subtotal:</strong>
              <OrderCurrencyFormatter amount={order.totalAmount} />
            </p>
            <p>
              <strong>Shipping:</strong>
              <OrderCurrencyFormatter amount={order.shippingCost} />
            </p>
            <p>
              <strong>VAT:</strong>
              <OrderCurrencyFormatter amount={order.vatAmount} />
            </p>
            <p className="text-lg font-semibold mt-2">
              <strong>Grand Total:</strong>{" "}
              <OrderCurrencyFormatter
                amount={
                  order.totalAmount + order.shippingCost + order.vatAmount
                }
              />
            </p>
            {order.customerNotes && (
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Customer Notes:</strong> {order.customerNotes}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Customer Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {order.user.firstName}{" "}
              {order.user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
          </CardContent>
        </Card>

        {/* Shipping Address Card */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Recipient:</strong> {order.address.fullName}
            </p>
            <p>
              <strong>Street Address:</strong> {order.address.streetAddress}
            </p>
            {order.address.streetAddress2 && (
              <p>
                <strong> Street Address 2:</strong>
                {order.address.streetAddress2}
              </p>
            )}
            <p>
              <strong>City:</strong> {order.address.city}
            </p>
            <p>
              <strong>Suburb:</strong> {order.address.suburb}
            </p>
            <p>
              <strong>Province:</strong> {order.address.province}
            </p>
            <p>
              <strong>Postal Code:</strong> {order.address.postalCode}
            </p>
            <p>
              <strong>Country:</strong> {order.address.country}
            </p>
            <p>
              <strong>PhoneNumber:</strong> {order.address.phoneNumber}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Order Items Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product.name}
                  </TableCell>
                  <TableCell>{item.product.sku}</TableCell>
                  <TableCell className="text-right">
                    <OrderCurrencyFormatter amount={item.price} />
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <OrderCurrencyFormatter
                      amount={item.price * item.quantity}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Order Status and Payment Status Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Update Order Status Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              <strong>Current Status:</strong>{" "}
              <span className="font-semibold text-primary">
                {order.status.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </p>
            <UpdateOrderForm
              orderId={order.id}
              currentStatus={order.status}
              currentTransactionId={order.transactionId || undefined}
              currentPaymentGatewayId={order.paymentGatewayId || undefined}
              currentCancellationReason={order.cancellationReason || undefined}
              currentActualDeliveryDate={order.actualDeliveryDate || undefined}
            />
          </CardContent>
        </Card>

        {/* Update Payment Status Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              <strong>Current Payment Status:</strong>{" "}
              <span className="font-semibold text-primary">
                {order.paymentStatus.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </p>
            <UpdatePaymentForm
              orderId={order.id}
              currentPaymentStatus={order.paymentStatus}
              currentTransactionId={order.transactionId || undefined}
              currentPaymentGatewayId={order.paymentGatewayId || undefined}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default AdminOrderDetailsPage;
