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
import { deleteNoteAction } from "@/server/actions/admin/note";

type Params = Promise<{ noteId: string }>;

const DeleteNoteRoutePage = async ({ params }: { params: Params }) => {
  const { noteId } = await params;
  // console.log("noteId:", noteId);
  return (
    <Container>
      <Card className="max-w-lg mx-auto w-full my-40">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            note.
          </CardDescription>
        </CardHeader>
        <CardContent>
          note: <span>{noteId}</span>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" size={"store"}>
            <Link href={`/admin/notes`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteNoteAction(noteId);
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

export default DeleteNoteRoutePage;
