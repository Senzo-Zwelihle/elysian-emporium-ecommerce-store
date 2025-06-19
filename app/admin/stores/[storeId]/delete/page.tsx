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
import { deleteStoreAction } from "@/server/actions/admin/store";

type Params = Promise<{ storeId: string }>;

const DeleteStoreRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteNoteRoute Params:", params);
  const { storeId } = await params;
  // console.log("collectionId:", collectionId);
  return (
    <Container>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          store: <span>{storeId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"lg"}>
            <Link href={`/admin/collections`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteStoreAction(storeId);
            }}
          >
            <FormSubmitButton
              text="Delete Store"
              variant="destructive"
              icon={<TrashIcon className="size-4" />}
            />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteStoreRoutePage;
