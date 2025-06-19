"use client";

import React from "react";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { enZA } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrderStatus } from "@/lib/generated/prisma";
import { adminUpdateOrderStatusAction } from "@/server/actions/admin/order";
import { updateZodOrderStatusSchema } from "@/schemas/admin/order";

interface UpdateOrderStatusFormProps {
  orderId: string;
  currentStatus: OrderStatus;
  currentTransactionId?: string;
  currentPaymentGatewayId?: string;
  currentCancellationReason?: string;
  currentActualDeliveryDate?: Date;
}
const UpdateOrderForm = ({
  orderId,
  currentStatus,
  currentTransactionId,
  currentPaymentGatewayId,
  currentCancellationReason,
  currentActualDeliveryDate,
}: UpdateOrderStatusFormProps) => {
  const form = useForm<z.infer<typeof updateZodOrderStatusSchema>>({
    resolver: zodResolver(updateZodOrderStatusSchema),
    defaultValues: {
      status: currentStatus,
      transactionId: currentTransactionId || "",
      paymentGatewayId: currentPaymentGatewayId || "",
      cancellationReason: currentCancellationReason || "",
      actualDeliveryDate: currentActualDeliveryDate || undefined, // Set default for date
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof updateZodOrderStatusSchema>) {
    const res = await adminUpdateOrderStatusAction(orderId, values);

    if (res.success) {
      toast.success("Order status updated successfully!");
    } else {
      toast.error(res.error || "Failed to update order status.");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(OrderStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/([A-Z])/g, " $1").trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch("status") === OrderStatus.Cancelled ||
          form.watch("status") === OrderStatus.Returned) && (
          <FormField
            control={form.control}
            name="cancellationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation/Return Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Reason for cancellation or return"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("status") === OrderStatus.Delivered && (
          <FormField
            control={form.control}
            name="actualDeliveryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Actual Delivery Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: enZA })
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., tx_abc123"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentGatewayId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Gateway ID (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., pgi_xyz456"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Order Status"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateOrderForm;
