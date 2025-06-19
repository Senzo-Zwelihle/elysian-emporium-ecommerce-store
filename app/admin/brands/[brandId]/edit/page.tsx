import React from "react";
import { Container } from "@/components/ui/container";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/client/prisma";
import UpdateBrandForm from "@/components/forms/update/update-brand";

async function getBrandPost({ brandId }: { brandId: string }) {
  const brandPost = await prisma.brand.findUnique({
    where: {
      id: brandId,
    },
    select: {
      id: true,
      company: true,
      logo: true,
      active: true,
    },
  });

  if (!brandPost) {
    return notFound();
  }

  return brandPost;
}

type Params = Promise<{ brandId: string }>;

const EditBrandRoutePage = async ({ params }: { params: Params }) => {
  const { brandId } = await params;

  const brandPost = await getBrandPost({ brandId });

  if (!brandPost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <UpdateBrandForm
        brandPost={{
          ...brandPost,
        }}
      />
    </Container>
  );
};

export default EditBrandRoutePage;
