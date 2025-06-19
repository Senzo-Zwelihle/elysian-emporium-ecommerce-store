import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon, ClockIcon, FileCodeIcon, TrashIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import BlockNoteViewer from "@/components/shared/blocknote-viewer";
import { prisma } from "@/lib/client/prisma";
import { setNoteAction, setNoteStatus, setNoteTag } from "@/types/admin/note";

async function getNoteData({ noteId }: { noteId: string }) {
  const notePost = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      tag: true,
      status: true,
      action: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
          profileImage: true,
        },
      },
    },
  });

  if (!notePost) {
    return notFound();
  }

  return notePost;
}

type Params = Promise<{ noteId: string }>;
const NoteIdRoutePage = async ({ params }: { params: Params }) => {
  const { noteId } = await params;
  const notePost = await getNoteData({ noteId });

  // color grading badges
  const noteTag = setNoteTag(notePost.tag ?? "");
  const noteStatus = setNoteStatus(notePost.status ?? "");
  const noteAction = setNoteAction(notePost.action ?? "");

  if (!notePost) {
    return notFound();
  }
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <div className="py-6 animate-in fade-in duration-500">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <h1 className="text-2xl font-bold tracking-tight">
                {notePost.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {/* tag */}

                {noteTag.label && (
                  <Badge className={`${noteTag.color}`}>{noteTag.label}</Badge>
                )}
                {/* status */}
                {noteStatus.label && (
                  <Badge className={`${noteStatus.color}`}>
                    {noteStatus.label}
                  </Badge>
                )}
                {/* action */}
                {noteAction.label && (
                  <Badge className={`${noteAction.color}`}>
                    {noteAction.label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-2">
              <CalendarIcon />
              <span>
                Created:
                {new Intl.DateTimeFormat("en-US").format(notePost.createdAt)}
              </span>
              <ClockIcon className="h-4 w-4 ml-0 sm:ml-4 mt-2 sm:mt-0" />
              <span>
                Updated:{" "}
                {new Intl.DateTimeFormat("en-US").format(notePost.updatedAt)}
              </span>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <div className="prose max-w-none dark:prose-invert">
              <BlockNoteViewer blockNoteContent={notePost.content} />
            </div>

            <Separator className="my-6 mb-6" />
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={
                    notePost.user.profileImage ||
                    "/placeholder.svg?height=40&width=40"
                  }
                  alt={notePost.user.firstName}
                />
                <AvatarFallback>
                  {notePost.user.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{notePost.user.firstName}</p>
                <p className="text-xs text-muted-foreground">
                  {notePost.user.email}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-4">
              <Button
                variant={"outline"}
                size={"store"}
                effect="expandIcon"
                icon={FileCodeIcon}
                iconPlacement="right"
              >
                <Link href={`/admin/notes/${notePost.id}/edit`}> Edit</Link>
              </Button>
              <Button
                variant={"destructive"}
                size={"store"}
                effect="expandIcon"
                icon={TrashIcon}
                iconPlacement="right"
              >
                <Link href={`/admin/notes/${notePost.id}/delete`}>Delete</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
};

export default NoteIdRoutePage;
