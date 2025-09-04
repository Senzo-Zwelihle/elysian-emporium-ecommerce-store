import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { prisma } from "@/lib/prisma/client";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShippingCard from "@/components/account/shipping-card";
import { MapPinIcon } from "@/components/icons/map-pin";


async function getAllShippingAddresses() {
  noStore();
  const addresses = await prisma.shipping.findMany({
    select: {
      id: true,
      userId: true,
      label: true,
      type: true,
      fullName: true,
      phoneNumber: true,
      country: true,
      city: true,
      suburb: true,
      province: true,
      streetAddress: true,
      streetAddress2: true,
      postalCode: true,
      isDefault: true,
      orders: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return addresses;
}

const Shipping = async () => {
     noStore();
  const addresses = await getAllShippingAddresses();
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"screen"}
      padding={"px-md"}
      gap={"none"}
      flow={"none"}
      id="shipping"
      className="pt-24"
    >
      <Heading
        font={"aeonikBold"}
        size={"md"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"md"}
      >
        Shipping
      </Heading>

      {/* data */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <ShippingCard key={address.id} address={address} />
        ))}

        {/* Add New Address Card */}
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors duration-200 cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[320px] text-center p-8">
            <div className="rounded-full bg-muted p-6 mb-6 group-hover:bg-primary/10 transition-colors duration-200">
              <MapPinIcon className=" text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
           
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Add a new shipping address to your account for faster checkout
            </p>
             <Button  className="mb-3">
              <Link href={"/account/shipping/create"}>Add Address</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Shipping;
