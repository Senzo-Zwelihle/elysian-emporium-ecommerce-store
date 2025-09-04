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
import { deleteAdminOrderAction } from "@/server/actions/admin/order";

type Params = Promise<{ orderId: string }>;

const DeleteOrderRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteNoteRoute Params:", params);
  const { orderId } = await params;
  // console.log("billboardId:", billboardId);
  return (
    <Container>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          Order: <span>{orderId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"default"}>
            <Link href={`/admin/orders`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteAdminOrderAction(orderId);
            }}
          >
            <FormSubmitButton
              text="Delete Order"
              variant="destructive"
              icon={<TrashIcon />}
            />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteOrderRoutePage;
