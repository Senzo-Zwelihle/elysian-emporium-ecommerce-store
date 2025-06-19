import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarIcon,
  ChevronLeftIcon,
  FileTextIcon,
  TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/client/prisma";

async function getBillboardData({ billboardId }: { billboardId: string }) {
  const billboardPost = await prisma.billboard.findUnique({
    where: {
      id: billboardId,
    },
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      url: true,
      state: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!billboardPost) {
    return notFound();
  }

  return billboardPost;
}

type Params = Promise<{ billboardId: string }>;
const BillboardIdRoutePage = async ({ params }: { params: Params }) => {
  const { billboardId } = await params;
  const billboardPost = await getBillboardData({ billboardId });

  if (!billboardPost) {
    return notFound();
  }

  const formattedDate = new Date(billboardPost.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <div className="flex items-center gap-4 mb-6 md:mb-8 my-6">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="shadow-sm hover:scale-105 transition-transform"
        >
          <Link href={"/admin/billboards"}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <Badge variant="outline" className="text-xs font-mono">
          {billboardPost.id}
        </Badge>
      </div>

      <div className=" mx-auto space-y-8 md:space-y-12">

        <div className="rounded-xl overflow-hidden shadow-xl bg-gradient-to-b from-background to-muted/20">
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <Image
              src={billboardPost.image || "/svg/vercel-placeholder.svg"}
              alt={billboardPost.label}
              width={400}
              height={400}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover w-full h-auto hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="space-y-6 ">
          <Heading
            size={"md"}
            font={"PolySans"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"sm"}
          >
            {billboardPost.label}
          </Heading>

          <Separator className="my-6" />
          <div className="space-y-4">
            {billboardPost.description && (
              <div className="flex items-start gap-3  rounded-lg  transition-colors">
                <FileTextIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-muted-foreground">
                    {billboardPost.description}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              {billboardPost.category && (
                <div className="flex items-center gap-3 rounded-lg transition-colors">
                  <TagIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium mb-1">Category</p>
                    <Badge variant="secondary">{billboardPost.category}</Badge>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3  rounded-lg transition-colors">
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium mb-1">Created</p>
                  <p className="text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
        </div>
      </div>
    </Container>
  );
};

export default BillboardIdRoutePage;
