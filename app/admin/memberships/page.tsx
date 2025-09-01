import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CrownIcon from "@/components/icons/crown";
import { PlusIcon } from "@/components/icons/plus";

import { fetchAllMemberships } from "@/app/api/admin/membership";

const MembershipsPage = async () => {
  noStore();
  const memberships = await fetchAllMemberships();
  if (memberships.length === 0) {
    return (
      <Container
        size={"2xl"}
        alignment={"none"}
        height={"full"}
        padding={"px-sm"}
        gap={"none"}
        flow={"none"}
        id="memberships"
        className="my-4"
      >
        <div className="flex items-center justify-between mb-8">
          <Heading
            font={"aeonik"}
            size={"md"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"sm"}
          >
            memberships
          </Heading>
        </div>

        <div className=" border-2 border-muted-foreground/25 rounded-2xl">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted">
              <CrownIcon className="size-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No memberships yet</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              You haven't created any memberships yet. Get started
            </p>
            <Button>
              <Link href={"/admin/memberships/create"}>Create New</Link>
            </Button>
          </div>
        </div>
      </Container>
    );
  }
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="memberships"
      className="my-4 space-y-4"
    >
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Memberships
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href={"/admin/memberships/create"}>Create New</Link>
        </Button>
      </div>

      {/* data */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memberships.map((membership) => (
          <Card key={membership.id} className="flex flex-col relative pt-12">
            {membership.popular && (
              <Badge className="flex space-x-2  tabular-nums absolute top-0 right-0  justify-center items-center translate-x-1 -translate-y-1">
                Popular
                <SparklesIcon className="size-4" />
              </Badge>
            )}

            {/* Crown Image Container */}
            {membership.crown && (
              <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center items-center">
                <Image
                  src={membership.crown}
                  alt={`${membership.title} crown`}
                  width={16}
                  height={16}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-16 h-16 object-contain"
                />
              </div>
            )}

            <CardHeader>
              <CardTitle className="font-medium text-center">
                {membership.title}
              </CardTitle>

              {/* Users count */}
              <div className="flex items-center justify-center space-x-2 my-2">
                <span className="text-xl font-semibold">
                  {membership.users.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {membership.users.length === 1 ? "User" : "Users"}
                </span>
              </div>

              <div className="text-center text-sm font-semibold ">
                {membership.minPoints} - {membership.maxPoints} Points
              </div>
              <CardDescription className="text-sm text-center">
                {membership.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {membership.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="size-3" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="grid grid-cols-2 gap-4 mt-auto px-6 py-4">
              <Button asChild>
                <Link href={`/admin/memberships/${membership.id}/update`}>
                  Edit
                </Link>
              </Button>
              <Button asChild variant={"destructive"}>
                <Link href={`/admin/memberships/${membership.id}/delete`}>
                  Delete
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default MembershipsPage;
