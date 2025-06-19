"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPinIcon, PlusIcon, AlertCircleIcon } from "lucide-react";
import { Address } from "@/types/store/check-out";

interface ShippingAddressFormProps {
  initialAddresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
}
const OrderShippingForm = ({
  initialAddresses,
  selectedAddressId,
  onSelectAddress,
}: ShippingAddressFormProps) => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Shipping Address</h3>

        {initialAddresses.length > 0 ? (
          <RadioGroup
            value={selectedAddressId}
            onValueChange={onSelectAddress}
            className="space-y-4"
          >
            {initialAddresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className="mt-1"
                />

                <div className="flex-1">
                  <Label htmlFor={address.id} className="cursor-pointer block">
                    <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{address.fullName}</span> 
                        {address.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{address.streetAddress}</p>
                        {address.streetAddress2 && (
                          <p>{address.streetAddress2}</p>
                        )}

                        <p>
                          {address.city}, {address.province}{" "}
                          {address.postalCode}
                        </p>
                        <p>{address.country}</p>
                        <p>Phone: {address.phoneNumber}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <Alert variant="default">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>No Shipping Address Found</AlertTitle>
            <AlertDescription>
              You need to add a shipping address before proceeding.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => router.push("/account/addresses?checkout=true")}
      >
        <PlusIcon className="w-4 h-4 mr-2" /> Add New Address
      </Button>

      <div className="bg-muted/40 p-4 rounded-lg border">
        <div className="flex items-center space-x-2 mb-2">
          <MapPinIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-base">Delivery Information</span>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Standard delivery: 3-5 business days</p>
          <p>
            • Delivery fee: Standard rate applies or free for orders over R500.
          </p>
          <p>• Delivery Monday - Friday, 9 AM - 6 PM</p>
        </div>
      </div>
    </div>
  );
};

export default OrderShippingForm;
