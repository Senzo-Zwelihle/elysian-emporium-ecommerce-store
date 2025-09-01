import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";

import { CalendarIcon, ClockIcon } from "lucide-react";

import { prisma } from "@/lib/prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";

import {
  NoteActionColor,
  NoteStatusColor,
  NoteTagColor,
} from "@/types/admin/note";
import BlockNoteRender from "@/components/tools/blocknote-render";

async function fetchNoteId({ noteId }: { noteId: string }) {
  noStore();
  const data = await prisma.note.findUnique({
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
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ noteId: string }>;

const ViewNotePage = async ({ params }: { params: Params }) => {
  noStore();
  const { noteId } = await params;
  const data = await fetchNoteId({ noteId });
  // color grading badges
  const noteTag = NoteTagColor(data.tag ?? "");
  const noteStatus = NoteStatusColor(data.status ?? "");
  const noteAction = NoteActionColor(data.action ?? "");
  return (
    <Container
      id="view-note"
      size={"2xl"}
      alignment={"none"}
      height={"screen"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      className="my-4"
    >
      <div className="py-6 animate-in fade-in duration-500">
        <Card className="shadow-lg border-t-4 border-t-primary bg-background">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <h1 className="text-2xl font-bold tracking-tight">
                {data.title}
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
                {new Intl.DateTimeFormat("en-US").format(data.createdAt)}
              </span>
              <ClockIcon className="h-4 w-4 ml-0 sm:ml-4 mt-2 sm:mt-0" />
              <span>
                Updated:{" "}
                {new Intl.DateTimeFormat("en-US").format(data.updatedAt)}
              </span>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <div className="prose max-w-none dark:prose-invert">
              <BlockNoteRender initialContent={data.content} />
            </div>

            <Separator className="my-6 mb-6" />
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={data.user.image || "/placeholder.svg?height=40&width=40"}
                  alt={data.user.name}
                />
                <AvatarFallback>{data.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{data.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {data.user.email}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-4">
              <Button variant={"outline"}>
                <Link href={`/admin/documents/notes/${data.id}/update`}>
                  Edit
                </Link>
              </Button>
              <Button variant={"destructive"}>
                <Link href={`/admin/documents/notes/${data.id}/delete`}>
                  Delete
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
};

export default ViewNotePage;
