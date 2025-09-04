"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Package, Truck, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OrderStatus } from "@/lib/generated/prisma";
import { OrderWithRelations } from "@/types/store/prisma-relations";
import { CopyButton } from "@/utils/store/copy-button";
import { dateFormat, formatPrice } from "@/lib/utils/store";
import { orderStatusColors, paymentStatusColors } from "@/types/store/order";


interface OrderDetailsPageContentProps {
  order: OrderWithRelations;
}

const statusProgress: Record<OrderStatus, number> = {
  pending: 1,
  confirmed: 2,
  processing: 3,
  packed: 4,
  shipped: 5,
  outfordelivery: 6,
  delivered: 7,
  cancelled: 0,
  returned: 0,
};

export function OrderDetailsPageContent({
  order,
}: OrderDetailsPageContentProps) {
  const subtotal = order.totalAmount - order.shippingCost - order.vatAmount;

  return (
    <div className="space-y-6">
      {/* Order Header and Basic Info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Order{" "}
            <span className="text-muted-foreground">#{order.orderNumber}</span>
            <CopyButton value={order.orderNumber} className="h-6 w-6 p-0" />
          </h2>
          <p className="text-sm text-muted-foreground">
            Placed on {dateFormat(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={orderStatusColors[order.status]} variant="outline">
            {order.status}
          </Badge>
          <Badge
            className={paymentStatusColors[order.paymentStatus]}
            variant="outline"
          >
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Progress Tracker for Active Orders */}
      {!["Cancelled", "Returned"].includes(order.status) && (
        <div className="space-y-3">
          <h3 className="font-medium">Order Progress</h3>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {" "}
            {/* Added overflow for small screens */}
            {[
              { status: "Confirmed", icon: FileText },
              { status: "Processing", icon: Package },
              { status: "Packed", icon: Package },
              { status: "Shipped", icon: Truck },
              { status: "Delivered", icon: FileText },
            ].map(({ status, icon: Icon }, index) => {
              const isCompleted = statusProgress[order.status] > index + 1;
              const isCurrent = statusProgress[order.status] === index + 2;

              return (
                <div
                  key={status}
                  className="flex flex-col items-center flex-shrink-0 mx-2"
                >
                  {" "}
                  {/* Added flex-shrink-0 and mx-2 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted || isCurrent
                        ? "bg-primary border-primary text-white"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-sm mt-1 text-center ${
                      isCompleted || isCurrent
                        ? "text-primary font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Separator />

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="font-medium">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 border rounded-lg"
            >
              <div className="relative h-16 w-16 rounded-lg overflow-hidden  flex-shrink-0">
                {item.product.images?.[0] && (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className=" transition-colors block"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                {" "}
                {/* Hidden on small screens */}
                <p className="font-medium">{formatPrice(item.price)}</p>
                <p className="text-sm text-muted-foreground">each</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <p className="text-sm text-muted-foreground">total</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping shipping */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            Shipping shipping
          </h3>
          <div className="p-3 border-2 rounded-lg">
            <p className="text-sm">
              {order.shipping.streetAddress}
              <br />
              {order.shipping.streetAddress2 && (
                <>
                  {order.shipping.streetAddress2}
                  <br />
                </>
              )}
              {order.shipping.city}, {order.shipping.province}
              <br />
              {order.shipping.postalCode}
              <br />
              {order.shipping.country}
            </p>
            {order.shipping.fullName && (
              <p className="text-xs text-gray-500 mt-1">
                Recipient: {order.shipping.fullName}
              </p>
            )}
            {order.shipping.phoneNumber && (
              <p className="text-xs text-gray-500">
                Phone: {order.shipping.phoneNumber}
              </p>
            )}
          </div>
        </div>

        {/* Payment & Order Summary */}
        <div className="space-y-4 p-3 rounded-lg border-2">
          {/* Payment Method */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-2">
              Payment Method
            </h3>
            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            {order.transactionId && (
              <p className="text-xs text-gray-500 mt-1">
                Transaction ID: {order.transactionId}
              </p>
            )}
          </div>

          {/* Order Total */}
          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT:</span>
                <span>{formatPrice(order.vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-base">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Notes */}
      {order.customerNotes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Customer Notes</h3>
            <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
              {order.customerNotes}
            </p>
          </div>
        </>
      )}

      {/* Important Dates */}
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-medium mb-1">Order Placed</h4>
          <p className="text-gray-600 flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {dateFormat(order.createdAt)}
          </p>
        </div>
        {order.expectedDeliveryDate && (
          <div>
            <h4 className="font-medium mb-1">Expected Delivery</h4>
            <p className="text-gray-600 flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {dateFormat(order.expectedDeliveryDate)}
            </p>
          </div>
        )}
        {order.actualDeliveryDate && (
          <div>
            <h4 className="font-medium  mb-1">Delivered On</h4>
            <p className="text-gray-600 flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {dateFormat(order.actualDeliveryDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
