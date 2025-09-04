import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { SearchIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";

import { prisma } from "@/lib/prisma/client";

async function fetchCategoriesWithImages() {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      products: {
        where: {
          status: "active",
        },
        select: {
          id: true,
          images: true,
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          products: {
            where: {
              status: "active",
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
    featuredImage: category.products[0]?.images[0] || null,
  }));
}


const CategoriesPage = async () => {
  noStore();
  const categories = await fetchCategoriesWithImages();

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="categories"
      className="pt-24 pb-12"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading
            font={"aeonikBold"}
            size={"md"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"none"}
            className="text-4xl md:text-5xl"
          >
            Shop by Category
          </Heading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of products
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {categories.length} Categories Available
          </Badge>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="w-full h-[480px] group mx-auto bg-card p-2 border overflow-hidden rounded-md text-card-foreground">
              <figure className="w-full h-80 group-hover:h-72 transition-all duration-300 bg-muted p-2 rounded-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full group-hover:opacity-100 opacity-0 transition-all duration-300 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                {category.featuredImage ? (
                  <Image
                    src={category.featuredImage}
                    alt={category.name}
                    width={600}
                    height={600}
                    className="absolute -bottom-1 group-hover:-bottom-5 right-0 h-64 w-[80%] group-hover:border-4 border-4 group-hover:border-primary/20 rounded-lg object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="absolute -bottom-1 group-hover:-bottom-5 right-0 h-64 w-[80%] group-hover:border-4 border-4 group-hover:border-primary/20 rounded-lg transition-all duration-300 flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground text-sm">No Image</span>
                  </div>
                )}
              </figure>
              <article className="p-4 space-y-2">
                <div className="h-8 w-20 bg-primary rounded-md"></div>
                <h1 className="text-xl font-semibold capitalize">
                  {category.name}
                </h1>
                <p className="text-base leading-[120%]">
                  Discover amazing products in {category.name.toLowerCase()}
                </p>
                <Link
                  href={`/category/${category.id}`}
                  className="text-base text-primary font-normal group-hover:opacity-100 opacity-0 translate-y-2 group-hover:translate-y-0 pt-2 flex gap-1 transition-all duration-300"
                >
                  Browse {category.name}
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </article>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="w-full h-[480px] mx-auto p-2 bg-card border overflow-hidden rounded-md text-card-foreground">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold">No Categories Available</h2>
              <p className="text-base text-muted-foreground text-center">
                There are currently no categories available. Please check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CategoriesPage;
