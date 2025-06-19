import React from "react";
import { Container } from "@/components/ui/container";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/client/prisma";
import UpdateCollectionForm from "@/components/forms/update/update-collection";

async function getCollectionPost({ collectionId }: { collectionId: string }) {
  const collectionPost = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
    select: {
      id: true,
      label: true,
      description: true,
      color: true,
      category: true,
      image: true,
      url: true,
      state: true,
    },
  });

  if (!collectionPost) {
    return notFound();
  }

  return collectionPost;
}

type Params = Promise<{ collectionId: string }>;

const EditCollectionRoutePage = async ({ params }: { params: Params }) => {
  const { collectionId } = await params;

  const collectionPost = await getCollectionPost({ collectionId });

  if (!collectionPost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <UpdateCollectionForm
        collectionPost={{
          ...collectionPost,
          description: collectionPost.description ?? "",
          url: collectionPost.url ?? "",
          category: String(collectionPost.category),
          state: String(collectionPost.state),
          color: collectionPost.color ?? "",
        }}
      />
    </Container>
  );
};

export default EditCollectionRoutePage;
