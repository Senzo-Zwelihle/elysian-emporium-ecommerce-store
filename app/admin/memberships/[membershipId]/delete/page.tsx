import React from "react";
import { notFound, redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma/client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DeleteButton } from "@/components/ui/delete";

import { deleteMembershipAction } from "@/server/actions/admin/membership";

type Params = Promise<{ membershipId: string }>;

const DeleteMembershipPage = async ({ params }: { params: Params }) => {
  noStore();
  const { membershipId } = await params;

  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
    include: {
      users: true,
    },
  });

  if (!membership) {
    return notFound();
  }

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="delete"
      className="my-4"
    >
      <Card className="max-w-lg mx-auto w-full  bg-background">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            following membership:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {membership.crown && (
              <Image
                src={membership.crown}
                alt={`${membership.title} crown`}
                width={16}
                height={16}
                unoptimized
                className="w-16 h-16 object-contain"
              />
            )}
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{membership.title}</h3>
            <p className="text-muted-foreground">{membership.description}</p>
            <div className="flex justify-center items-center space-x-2 my-2">
              <span className=" font-semibold">{membership.users.length}</span>
              <span className="text-sm text-muted-foreground">
                {membership.users.length === 1 ? "User" : "Users"}
              </span>
            </div>
            <div className="text-center text-sm font-semibold">
              {membership.minPoints} - {membership.maxPoints} Points
            </div>
          </div>
          <hr className="border-dashed rounded-b-4xl" />
          <h4 className="font-medium text-center">Benefits:</h4>
          <ul className="list-disc list-inside text-sm space-y-2">
            {membership.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/admin/memberships`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteMembershipAction(membershipId);
              redirect("/admin/memberships");
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteMembershipPage;
