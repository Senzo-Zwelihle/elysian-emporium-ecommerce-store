import React from "react";
import { Container } from "@/components/ui/container";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/client/prisma";
import UpdateBillboardForm from "@/components/forms/update/update-billboard";

async function getBillboardPost({ billboardId }: { billboardId: string }) {
  const billboardPost = await prisma.billboard.findUnique({
    where: {
      id: billboardId,
    },
    select: {
      id: true,
      label: true,
      description: true,
      category: true,
      image: true,
      url: true,
      state: true,
    },
  });

  if (!billboardPost) {
    return notFound();
  }

  return billboardPost;
}

type Params = Promise<{ billboardId: string }>;

const EditBillboardRoutePage = async ({ params }: { params: Params }) => {
  const { billboardId } = await params;

  const billboardPost = await getBillboardPost({ billboardId });

  if (!billboardPost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <UpdateBillboardForm
        billboardPost={{
          ...billboardPost,
          description: billboardPost.description ?? "",
          url: billboardPost.url ?? "",
          category: String(billboardPost.category),
          state: String(billboardPost.state),
        }}
      />
    </Container>
  );
};

export default EditBillboardRoutePage;
