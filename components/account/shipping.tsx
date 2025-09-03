"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import {
  BuildingIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserAccountData } from "@/types/user/account/data";

interface AddressesTabProps {
  addresses: UserAccountData["shipping"];
}

const AddressCard = ({
  address,
}: {
  address: UserAccountData["shipping"][0];
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{address.label}</CardTitle>
              {address.isDefault && (
                <Badge variant="default" className="text-xs">
                  <StarIcon className="mr-1" />
                  Default
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {address.type === "residential" ? (
                  <HomeIcon className=" mr-1" />
                ) : (
                  <BuildingIcon className="mr-1" />
                )}
                {address.type}
              </Badge>
            </div>
            <CardDescription>
              Added{" "}
              {formatDistanceToNow(address.createdAt, { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Address Details */}
        <div className="space-y-2">
          <p className="font-medium">{address.fullName}</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{address.streetAddress}</p>
            {address.streetAddress2 && <p>{address.streetAddress2}</p>}
            <p>
              {address.suburb}, {address.city}
            </p>
            <p>
              {address.province.replace("_", " ").toUpperCase()},{" "}
              {address.postalCode}
            </p>
            {address.country && <p>{address.country}</p>}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <PhoneIcon className="size-4" />
              <span>{address.phoneNumber}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ShippingTabWrapper = ({ addresses }: AddressesTabProps) => {
  if (!addresses || addresses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
          <div>
            <MapPinIcon />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl ">No addresses saved</h3>
            <p className="max-w-sm mx-auto">
              Add shipping addresses to make checkout faster and easier.
            </p>
          </div>
          <Button className="mt-4">
            <Link href={"/account/shipping"}>Add Address</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Addresses</h2>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button>
          <Link href={"/account/shipping"}>Add Address</Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Addresses
            </CardTitle>
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{addresses.length}</div>
            <p className="text-xs text-muted-foreground">Saved addresses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Residential</CardTitle>
            <HomeIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter((addr) => addr.type === "residential").length}
            </div>
            <p className="text-xs text-muted-foreground">Home addresses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business</CardTitle>
            <BuildingIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {addresses.filter((addr) => addr.type === "business").length}
            </div>
            <p className="text-xs text-muted-foreground">Business addresses</p>
          </CardContent>
        </Card>
      </div>

      {/* Addresses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {addresses
          .sort((a, b) => {
            // Sort by default first, then by creation date
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
      </div>
    </div>
  );
};
