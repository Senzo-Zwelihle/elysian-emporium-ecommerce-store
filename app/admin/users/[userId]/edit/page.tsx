import React from "react";
import { Container } from "@/components/ui/container";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/client/prisma";
import UpdateUserForm from "@/components/admin/components/forms/update/update-user";

async function getUserPost({ userId }: { userId: string }) {
  const userPost = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      role: true,
      status: true,
      membership: true,
    },
  });

  if (!userPost) {
    return notFound();
  }

  return userPost;
}

type Params = Promise<{ userId: string }>;

const EditUserRoutePage = async ({ params }: { params: Params }) => {
  const { userId } = await params;

  const userPost = await getUserPost({ userId });

  if (!userPost) {
    return notFound();
  }

  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <UpdateUserForm userPost={userPost} />
    </Container>
  );
};

export default EditUserRoutePage;
