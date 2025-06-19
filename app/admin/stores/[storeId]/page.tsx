import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarIcon,
  ChevronLeftIcon,
  FileTextIcon,
  GlobeIcon,
  ImagesIcon,
  LocateIcon,
  NetworkIcon,
  TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/client/prisma";

async function getStoreData({ storeId }: { storeId: string }) {
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
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!storePost) {
    return notFound();
  }

  return storePost;
}

type Params = Promise<{ storeId: string }>;

const StoreIdRoutePage = async ({ params }: { params: Params }) => {
  const { storeId } = await params;

  const storePost = await getStoreData({ storeId });

  if (!storePost) {
    return notFound();
  }

  const formattedDate = new Date(storePost.createdAt).toLocaleDateString(
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
          size={"sm"}
          className="shadow-sm hover:scale-105 transition-transform"
          asChild
        >
          <Link href={"/admin/stores"}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <Badge variant="outline" className="text-xs font-mono">
          {storePost.id}
        </Badge>
      </div>

      <div className="mx-auto space-y-8 md:space-y-12">
        {/* Store Logo */}

        <div className="space-y-6">
          <Heading
            size={"md"}
            font={"PolySans"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"sm"}
          >
            {storePost.name}
          </Heading>

          <Separator className="my-6" />

          <div className="space-y-4">
            {storePost.description && (
              <div className="flex items-start gap-3 rounded-lg transition-colors">
                <FileTextIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Description</p>
                  <p className="text-muted-foreground">
                    {storePost.description}
                  </p>
                </div>
              </div>
            )}

            {storePost.location && (
              <div className="flex items-start gap-3 rounded-lg transition-colors">
                <LocateIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Location</p>
                  <p className="text-muted-foreground">{storePost.location}</p>
                </div>
              </div>
            )}

            {storePost.website && (
              <div className="flex items-start gap-3 rounded-lg transition-colors">
                <GlobeIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Website</p>
                  <Link
                    href={storePost.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:underline text-muted-foreground"
                  >
                    {storePost.website}
                  </Link>
                </div>
              </div>
            )}

            {storePost.socials && storePost.socials.length > 0 && (
              <div className="flex items-start gap-3 rounded-lg transition-colors">
                <NetworkIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Social Links</p>
                  <div className="flex flex-wrap gap-2">
                    {storePost.socials.map((socialLink, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1"
                      >
                        <a
                          href={socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          {socialLink.split("/")[2] || "Link"}{" "}
                        </a>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-lg transition-colors">
              <TagIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium mb-1">Status</p>
                <Badge
                  variant={
                    storePost.status === "Active" ? "default" : "destructive"
                  }
                >
                  {storePost.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg transition-colors">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium mb-1">Created At</p>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg transition-colors">
              <ImagesIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium mb-1">Logo</p>
                <Image
                  src={storePost.logo || "/placeholder.svg"}
                  alt={storePost.name}
                  width={80}
                  height={80}
                  priority
                  className="object-contain  hover:scale-105 transition-transform duration-700 p-4 rounded-lg" //
                />
              </div>
            </div>
          </div>
          <Separator className="my-6" />
        </div>
      </div>
    </Container>
  );
};

export default StoreIdRoutePage;
