import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/client/prisma";
import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";

async function fetchCategoryCollections() {
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      label: true,
      description: true,
      color: true,
      image: true,
      url: true,
      state: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return collections;
}

const Categories = async () => {
  noStore();
  const collections = await fetchCategoryCollections();
  // console.log(collections);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} id="categories">
      <Heading
        size={"md"}
        font={"PolySansMedian"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        Categories
      </Heading>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {collections.map((collection) => (
          <a
            key={collection.id}
            href={collection.url || "#"}
            className="flex flex-col items-center text-center group"
          >
            <div className=" rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src={collection.image || "/svg/vercel-placeholder.svg"}
                alt={collection.label}
                width={200}
                height={200}
                quality={95}
                className="object-contain"
              />
            </div>

            <span className="mt-6 text-2xl font-medium  group-hover:underline">
              {collection.label}
            </span>
          </a>
        ))}
      </div>
    </Container>
  );
};

export default Categories;
