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
import { deleteCollectionAction } from "@/server/actions/admin/collection";

type Params = Promise<{ collectionId: string }>;

const DeleteCollectionRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteNoteRoute Params:", params);
  const { collectionId } = await params;
  // console.log("collectionId:", collectionId);
  return (
    <Container>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          collection: <span>{collectionId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"store"}>
            <Link href={`/admin/collections`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteCollectionAction(collectionId);
            }}
          >
            <FormSubmitButton
              text="Delete Collection"
              variant="destructive"
              icon={<TrashIcon  />}
            />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteCollectionRoutePage;
