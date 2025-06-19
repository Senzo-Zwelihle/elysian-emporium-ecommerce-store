import React from "react";
import Link from "next/link";
import { TrashIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormSubmitButton } from "@/components/ui/form-button";
import { deleteProductAction } from "@/server/actions/admin/product";

type Params = Promise<{ productId: string }>;

const DeleteProductRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteNoteRoute Params:", params);
  const { productId } = await params;
  // console.log("productId:", productId);
  return (
    <Container>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          product: <span>{productId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"store"}>
            <Link href={`/admin/products`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteProductAction(productId);
            }}
          >
            <FormSubmitButton
              text="Delete Product"
              variant="destructive"
              icon={<TrashIcon  />}
            />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteProductRoutePage;
