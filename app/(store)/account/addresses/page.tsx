import React from "react";
import {
  EditIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/client/prisma";

async function fetchAddresses() {
  const addresses = await prisma.address.findMany({
    select: {
      id: true,
      label: true,
      fullName: true,
      streetAddress: true,
      streetAddress2: true,
      city: true,
      suburb: true,
      province: true,
      country: true,
      postalCode: true,
      phoneNumber: true,
      isDefault: true,
      createdAt: true,
      updatedAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return addresses;
}

const AddressesRoutePage = async () => {
  noStore();
  const addresses = await fetchAddresses();
  // console.log(addresses);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansBulky"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Addresses
        </Heading>
        <Button
          size={"store"}
          effect="expandIcon"
          icon={PlusIcon}
          iconPlacement="right"
        >
          <Link href={"/account/addresses/create-new"}>Add New </Link>
        </Button>
      </div>

      {/* billboard data */}
      <div>
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-40">
            <Heading
              size={"sm"}
              font={"PolySansSlim"}
              spacing={"normal"}
              lineHeight={"none"}
              margin={"md"}
            >
              No Addresses Found!
            </Heading>
            <MapPinIcon size={80} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-3 lg:grid-cols-4 mx-auto">
            {addresses.map((address) => (
              <div className={cn("group relative")} key={address.id}>
                <Card className="relative">
                  {address.isDefault && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <Badge>
                        <StarIcon className="w-4 h-4 fill-current mr-1" />
                        Default
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{address.label || address.fullName}</CardTitle>
                    <CardDescription>Delivery Address</CardDescription>
                    <CardAction>
                      <div className="flex items-center justify-end space-x-2 mt-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontalIcon />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/account/addresses/${address.id}/edit`}
                                className="flex items-center"
                              >
                                <EditIcon  />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="text-tall-poppy-600">
                              <Link
                                href={`/account/addresses/${address.id}/delete`}
                                className="flex items-center"
                              >
                                <TrashIcon />
                                Delete
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardAction>
                  </CardHeader>

                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      {address.fullName}
                    </p>
                    <p>{address.streetAddress}</p>
                    {address.streetAddress2 && <p>{address.streetAddress2}</p>}
                    <p>
                      {address.suburb}, {address.city}, {address.province},{" "}
                      {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    <p className="text-sm text-muted-foreground">
                      Phone: {address.phoneNumber}
                    </p>
                  </CardContent>

                  <CardFooter className="text-xs text-muted-foreground justify-between">
                    <p>
                      Added: {new Date(address.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      Updated:{" "}
                      {new Date(address.updatedAt).toLocaleDateString()}
                    </p>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default AddressesRoutePage;
