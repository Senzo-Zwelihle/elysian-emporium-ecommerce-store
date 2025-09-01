import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";

import { deleteWarehouseAction } from "@/server/actions/admin/warehouse";

type Params = Promise<{ warehouseId: string }>;

const DeleteWarehousePage = async ({ params }: { params: Params }) => {
  noStore();
  const { warehouseId } = await params;

  const warehouse = await prisma.warehouse.findUnique({
    where: { id: warehouseId },
  });

  if (!warehouse) {
    return (
      <Container>
        <Card className="max-w-lg mx-auto w-full my-40 bg-background">
          <CardHeader>
            <CardTitle>Warehouse not found</CardTitle>
            <CardDescription>
              The warehouse you are trying to delete does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button asChild variant="ghost">
              <Link href="/admin/warehouses">Back to Warehouses</Link>
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  return (
    <Container
      id="delete"
      size={"2xl"}
      alignment={"none"}
      height={"screen"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      className="my-4"
    >
      <Card className="max-w-lg mx-auto w-full my-40 bg-background">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            following warehouse:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {warehouse.id}
            </p>
            <p>
              <strong>Name:</strong> {warehouse.name}
            </p>
     
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/admin/categories`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteWarehouseAction(warehouseId);
              redirect("/admin/warehouses");
            }}
          >
            <Button type="submit" variant={"destructive"}>
              Delete
            </Button>
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteWarehousePage;
