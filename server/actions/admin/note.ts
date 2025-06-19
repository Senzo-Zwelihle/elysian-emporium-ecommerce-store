"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { NoteAction, NoteStatus, NoteTag } from "@/lib/generated/prisma";
import { noteZodSchema } from "@/schemas/admin/note";

// manual auth config
const auth = process.env.AUTH;

// create new note action
export async function createNewNoteAction(
  data: z.infer<typeof noteZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create notes.",
    };
  }

  try {
    const validated = noteZodSchema.parse(data);

    await prisma.note.create({
      data: {
        title: validated.title,
        content: [validated.content],
        tag: validated.tag as NoteTag,
        status: validated.status as NoteStatus,
        action: validated.action as NoteAction,
        published: validated.published === true ? true : false,
        //   attaching the user to a note
        user: {
          connect: {
            email: user.email,
          },
        },
      },
    });

    return {
      success: true,
      message: "Note created successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (CreateNewNoteAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating a new note.",
    };
  }
}

// edit existing note action

export async function editNoteAction(
  noteId: string,
  data: z.infer<typeof noteZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit notes.",
    };
  }

  try {
    const validated = noteZodSchema.parse(data);

    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: validated.title,
        content: [validated.content],
        tag: validated.tag as NoteTag,
        status: validated.status as NoteStatus,
        action: validated.action as NoteAction,
        published: validated.published === true ? true : false,
      },
    });

    return {
      success: true,
      message: "Note edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editNoteAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the note.",
    };
  }
}

// delete existing note action
export async function deleteNoteAction(noteId: string) {
  await prisma.note.delete({
    where: {
      id: noteId,
    },
  });

  return redirect("/admin/notes");
}
