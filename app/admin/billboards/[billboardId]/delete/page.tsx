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
import { deleteBillboardAction } from "@/server/actions/admin/billboard";

type Params = Promise<{ billboardId: string }>;

const DeleteBillboardRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteNoteRoute Params:", params);
  const { billboardId } = await params;
  // console.log("billboardId:", billboardId);
  return (
    <Container>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            billboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          billboard: <span>{billboardId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"store"}>
            <Link href={`/admin/billboards`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteBillboardAction(billboardId);
            }}
          >
            <FormSubmitButton
              text="Delete Billboard"
              variant="destructive"
              icon={<TrashIcon  />}
            />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteBillboardRoutePage;
