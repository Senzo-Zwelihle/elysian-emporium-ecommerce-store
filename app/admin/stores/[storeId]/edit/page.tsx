import React from "react";
import UpdateStoreForm from "@/components/forms/update/update-store";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/client/prisma";
import { notFound } from "next/navigation";

async function getStorePost({ storeId }: { storeId: string }) {
  const storePost = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      website: true,
      socials: true,
      logo: true,
      status: true,
    },
  });

  if (!storePost) {
    return notFound();
  }

  return storePost;
}

type Params = Promise<{ storeId: string }>;

const EditStoreRoute = async ({ params }: { params: Params }) => {
  const { storeId } = await params;

  const storePost = await getStorePost({ storeId });

  if (!getStorePost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <Heading
        size={"md"}
        font={"PolySansBulky"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        Edit Store: {storePost.name}
      </Heading>
      <UpdateStoreForm
        storeData={{
          ...storePost,
          description: storePost.description ?? null,
          socials: storePost.socials ?? [],
        }}
      />
    </Container>
  );
};

export default EditStoreRoute;
