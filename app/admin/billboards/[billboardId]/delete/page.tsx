import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { prisma } from "@/lib/prisma/client";

import { deleteCategoryAction } from "@/server/actions/admin/category";

type Params = Promise<{ brandId: string }>;

const DeleteCategoryPage = async ({ params }: { params: Params }) => {
  const { brandId } = await params;

  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
  });

  if (!brand) {
    return (
      <Container>
        <Card className="max-w-lg mx-auto w-full my-40 bg-background">
          <CardHeader>
            <CardTitle>Brand not found</CardTitle>
            <CardDescription>
              The brand you are trying to delete does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button asChild variant="ghost">
              <Link href="/admin/brands">Back to Brands</Link>
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  return (
    <Container
      size={"full"}
      alignment={"none"}
      height={"full"}
      gap={"none"}
      flow={"none"}
      padding={"px-sm"}
    >
      <Card className="max-w-lg mx-auto w-full my-40 bg-background">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            following brand:
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="space-y-2">
            <Image
              src={brand.logo}
              alt={`${brand.name}`}
              width={80}
              height={80}
              className="object-contain rounded"
            />
            <p>
              <strong>Name:</strong> {brand.name}
            </p>
            {/* Add more fields as needed, e.g. description, status, createdAt */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/admin/brands`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteCategoryAction(brandId);
              redirect("/admin/brands");
            }}
          >
            <Button
              type="submit"
              variant={"destructive"}
              effect="expandIcon"
              icon={Trash2Icon}
              iconPlacement="right"
            >
              Delete
            </Button>
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteCategoryPage;
