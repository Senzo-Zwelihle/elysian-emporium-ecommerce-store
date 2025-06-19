"use client";

import React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { PaymentStatus } from "@/lib/generated/prisma";
import { adminUpdatePaymentStatusAction } from "@/server/actions/admin/order";
import { updateZodPaymentSchema } from "@/schemas/admin/order";

interface UpdatePaymentStatusFormProps {
  orderId: string;
  currentPaymentStatus: PaymentStatus;
  currentTransactionId?: string;
  currentPaymentGatewayId?: string;
}

const UpdatePaymentForm = ({
  orderId,
  currentPaymentStatus,
  currentTransactionId,
  currentPaymentGatewayId,
}: UpdatePaymentStatusFormProps) => {
  const form = useForm<z.infer<typeof updateZodPaymentSchema>>({
    resolver: zodResolver(updateZodPaymentSchema),
    defaultValues: {
      paymentStatus: currentPaymentStatus,
      transactionId: currentTransactionId || "",
      paymentGatewayId: currentPaymentGatewayId || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof updateZodPaymentSchema>) {
    const res = await adminUpdatePaymentStatusAction(orderId, values);

    if (res.success) {
      toast.success("Payment status updated successfully!");
    } else {
      toast.error(res.error || "Failed to update payment status.");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PaymentStatus).map((status) => (
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
          {isLoading ? "Updating..." : "Update Payment Status"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdatePaymentForm;
