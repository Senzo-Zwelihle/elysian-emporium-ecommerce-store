import React from "react";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { SearchIcon } from "lucide-react";

import { prisma } from "@/lib/prisma/client";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function fetchCollections() {
  noStore();
  const data = await prisma.collection.findMany({
    where: {
      status: "active",
    },
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      categoryId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

 
  return data.map((collection) => ({
    ...collection,
    productCount: 0, 
  }));
}

const CollectionsPage = async () => {
  const collections = await fetchCollections();

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="collections"
      className="pt-24 pb-12"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading
            font={"aeonikBold"}
            size={"md"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"none"}
          >
            Collections
          </Heading>
          <p className="text-muted-foreground">
            Curated selections of our finest products
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search collections..." className="pl-10" />
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.label}
                    width={400}
                    height={225}
                    className="object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                )}
              </div>
              <CardHeader>
                <CardTitle>{collection.label}</CardTitle>
                <CardDescription>
                  {collection.description ||
                    `Collection in category ${collection.categoryId}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    View collection
                  </span>
                  <Button asChild>
                    <a href={`/collections/${collection.id}`}>
                      View Collection
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {collections.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <CardTitle className="mb-2">No Collections Available</CardTitle>
              <CardDescription>
                There are currently no collections available. Please check back
                later.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default CollectionsPage;
