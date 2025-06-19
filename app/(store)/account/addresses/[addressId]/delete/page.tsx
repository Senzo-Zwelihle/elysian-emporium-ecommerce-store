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
import { deleteAddressAction } from "@/server/actions/account/address";

type Params = Promise<{ addressId: string }>;

const DeleteAddressRoutePage = async ({ params }: { params: Params }) => {
  // console.log("DeleteNoteRoute Params:", params);
  const { addressId } = await params;
  // console.log("billboardId:", billboardId);
  return (
    <Container size={"2xl"} padding={"md"}>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          address: <span>{addressId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"store"}>
            <Link href={`/addresses`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteAddressAction(addressId);
            }}
          >
            <FormSubmitButton
              text="Delete Address"
              variant="destructive"
              icon={<TrashIcon  />}
            />
          </form>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DeleteAddressRoutePage;
