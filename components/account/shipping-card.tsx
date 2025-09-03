import React from "react";
import Link from "next/link";

import {
  Building2Icon,
  BuildingIcon,
  FilePenIcon,
  GlobeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  Trash2Icon,
  TruckIcon,
  UserIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Shipping } from "@/lib/generated/prisma";

const ShippingCard = ({ address }: { address: Shipping }) => {
  // shorten
  const formatProvince = (province: string) => {
    return province.replace(/([A-Z])/g, " $1").trim();
  };
  return (
    <Card className="relative group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
      {address.isDefault && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="gap-1.5">
            <StarIcon className="h-3.5 w-3.5 fill-current" />
            Default
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {address.type === "business" ? (
              <Building2Icon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <HomeIcon className="h-5 w-5 text-muted-foreground" />
            )}
            <h3 className="font-semibold text-lg">{address.label}</h3>
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            {address.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Full Name */}
        <div className="flex items-center gap-3">
          <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p className="font-medium text-foreground">{address.fullName}</p>
        </div>

        {/* Street Address */}
        <div className="flex items-start gap-3">
          <MapPinIcon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground">
              {address.streetAddress}
            </p>
            {address.streetAddress2 && (
              <p className="text-muted-foreground">{address.streetAddress2}</p>
            )}
          </div>
        </div>

        {/* City and Suburb */}
        <div className="flex items-center gap-3">
          <BuildingIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {address.suburb}, {address.city}
          </p>
        </div>

        {/* Province and Postal Code */}
        <div className="flex items-center gap-3">
          <TruckIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            {formatProvince(address.province)}, {address.postalCode}
          </p>
        </div>

        {/* Country */}
        {address.country && (
          <div className="flex items-center gap-3">
            <GlobeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{address.country}</p>
          </div>
        )}

        {/* Phone Number */}
        <div className="flex items-center gap-3">
          <PhoneIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={`/account/shipping/${address.id}/update`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full">
              <FilePenIcon className="size-4 mr-2" />
              Update
            </Button>
          </Link>

          <Link
            href={`/account/shipping/${address.id}/delete`}
            className="flex-1"
          >
            <Button variant="destructive" className="w-full">
              <Trash2Icon className="size-4 mr-2" />
              Delete
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingCard;
