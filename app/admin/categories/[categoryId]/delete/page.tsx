import React from "react";
import { notFound, redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

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

import { deleteCategoryAction } from "@/server/actions/admin/category";

type Params = Promise<{ categoryId: string }>;

const DeleteCategoryPage = async ({ params }: { params: Params }) => {
  noStore();
  const { categoryId } = await params;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      products: true,
      collections: true,
      billboards: true,
    },
  });

  if (!category) {
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
      <Card className="max-w-lg mx-auto w-full bg-background">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            following category:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{category.name}</h3>
            <div className="flex justify-center items-center space-x-2 my-2">
              <span className="font-semibold">{category.products.length}</span>
              <span className="text-sm text-muted-foreground">
                {category.products.length === 1 ? "Product" : "Products"}
              </span>
            </div>
            <div className="flex justify-center items-center space-x-2 my-2">
              <span className="font-semibold">{category.collections.length}</span>
              <span className="text-sm text-muted-foreground">
                {category.collections.length === 1 ? "Collection" : "Collections"}
              </span>
            </div>
            <div className="flex justify-center items-center space-x-2 my-2">
              <span className="font-semibold">{category.billboards.length}</span>
              <span className="text-sm text-muted-foreground">
                {category.billboards.length === 1 ? "Billboard" : "Billboards"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/admin/categories`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteCategoryAction(categoryId);
              redirect("/admin/categories");
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteCategoryPage;