import React from "react";
import { Container } from "@/components/ui/container";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/client/prisma";
import UpdateDocumentForm from "@/components/forms/update/update-document";

async function getDocumentPost({ documentId }: { documentId: string }) {
  const documentPost = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      state: true,
      files: true,
      images: true,
      published: true,
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
          profileImage: true,
        },
      },
    },
  });

  if (!documentPost) {
    return notFound();
  }

  return documentPost;
}

type Params = Promise<{ documentId: string }>;

const EditDocumentRoutePage = async ({ params }: { params: Params }) => {
  const { documentId } = await params;

  const documentPost = await getDocumentPost({ documentId });

  if (!documentPost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <UpdateDocumentForm
        documentPost={{
          ...documentPost,
        }}
      />
    </Container>
  );
};

export default EditDocumentRoutePage;
