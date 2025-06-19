import React from "react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  EditIcon,
  EyeIcon,
  FilePlus2Icon,
  FileTextIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/client/prisma";

async function fetchNotes() {
  const notes = await prisma.note.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return notes;
}

const NotesRoutePage = async () => {
  noStore();
  const notes = await fetchNotes();
  // console.log(notes);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansBulky"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Notes
        </Heading>
        <Button
          effect="expandIcon"
          icon={FilePlus2Icon}
          iconPlacement="right"
       size={"store"}
        >
          <Link href={"/admin/notes/create-new"}>Create Note</Link>
        </Button>
      </div>

      {/* notes data */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading
            size={"sm"}
            font={"PolySansSlim"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"md"}
          >
            No Notes Found!...
          </Heading>
          <FileTextIcon size={80} />
        </div>
      ) : (
        <div className="my-6">
          <Table>
            <TableCaption>Most recent notes created.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.title}</TableCell>
                  <TableCell>{note.tag}</TableCell>
                  <TableCell>{note.status}</TableCell>
                  <TableCell>{note.action}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <EyeIcon className="mr-2" />
                          <Link href={`/admin/notes/${note.id}`}>
                            View Note
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <EditIcon  />
                          <Link href={`/admin/notes/${note.id}/edit`}>
                            Edit Note
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <TrashIcon />
                          <Link href={`/admin/notes/${note.id}/delete`}>
                            Delete Note
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default NotesRoutePage;
