import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/client/prisma";
import UpdateNoteForm from "@/components/forms/update/update-note";

async function getNotePost({ noteId }: { noteId: string }) {
  const notePost = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      tag: true,
      status: true,
      action: true,
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

  if (!notePost) {
    return notFound();
  }

  return notePost;
}

type Params = Promise<{ noteId: string }>;

const EditNoteRoutePage = async ({ params }: { params: Params }) => {
  const { noteId } = await params;
  const notePost = await getNotePost({ noteId });

  if (!notePost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <UpdateNoteForm
        notePost={{
          ...notePost,
          tag: notePost.tag ?? "",
          status: notePost.status ?? "",
          action: notePost.action ?? "",
        }}
      />
    </Container>
  );
};

export default EditNoteRoutePage;
