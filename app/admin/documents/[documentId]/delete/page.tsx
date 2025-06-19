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
import { deleteDocumentAction } from "@/server/actions/admin/document";

type Params = Promise<{ documentId: string }>;

const DeleteDocumentRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteDocumentRoute Params:", params);
  const { documentId } = await params;
  // console.log("documentId:", documentId);
  return (
    <Container>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          document: <span>{documentId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"store"}>
            <Link href={`/admin/documents`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteDocumentAction(documentId);
            }}
          >
            <FormSubmitButton
              text="Delete Note"
              variant="destructive"
              icon={<TrashIcon  />}
            />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteDocumentRoutePage;
