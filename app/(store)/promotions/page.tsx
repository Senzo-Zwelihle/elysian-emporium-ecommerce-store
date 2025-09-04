import React from "react";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, TagIcon } from "lucide-react";
import { prisma } from "@/lib/prisma/client";

async function fetchPromotions() {
  noStore();
  const data = await prisma.promotion.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      products: {
        where: {
          status: "active",
        },
        select: {
          id: true,
        },
      },
      tags: {
        select: {
          label: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Add product count to each promotion
  return data.map(promotion => ({
    ...promotion,
    productCount: promotion.products.length,
  }));
}

const PromotionsPage = async () => {
  const promotions = await fetchPromotions();

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="promotions"
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
            Promotions
          </Heading>
          <p className="text-muted-foreground">
            Take advantage of our special offers and discounts
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search promotions..." 
            className="pl-10"
          />
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="hover:shadow-md transition-shadow">
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                {promotion.image ? (
                  <Image 
                    src={promotion.image} 
                    alt={promotion.label} 
                    width={400}
                    height={225}
                    className="object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{promotion.label}</CardTitle>
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                    New Arrivals
                  </span>
                </div>
                <CardDescription>{promotion.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TagIcon className="h-4 w-4" />
                    <span>{promotion.productCount} products</span>
                  </div>
                  <Button asChild>
                    <a href={`/products?promotion=${promotion.id}`}>View Deal</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {promotions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <CardTitle className="mb-2">No Promotions Available</CardTitle>
              <CardDescription>
                There are currently no promotions running. Please check back later for special offers.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default PromotionsPage;