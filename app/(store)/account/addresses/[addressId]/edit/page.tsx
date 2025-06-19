import React from "react";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/client/prisma";
import { notFound } from "next/navigation";
import UpdateAddressForm from "@/components/forms/update/update-address";

async function getAddressPost({ addressId }: { addressId: string }) {
  const addressPost = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
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
    },
  });

  if (!addressPost) {
    return notFound();
  }

  return addressPost;
}

type Params = Promise<{ addressId: string }>;

const CreateEditRoutePage = async ({ params }: { params: Params }) => {
  const { addressId } = await params;

  const addressPost = await getAddressPost({ addressId });

  if (!addressPost) {
    return notFound();
  }
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <UpdateAddressForm
        addressPost={{
          ...addressPost,
          label: addressPost.label ?? "",
          streetAddress: addressPost.streetAddress ?? "",
          streetAddress2: addressPost.streetAddress2 ?? "",
        }}
      />
    </Container>
  );
};

export default CreateEditRoutePage;
