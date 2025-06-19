import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NotebookTextIcon } from 'lucide-react';
import { NotesTabProps } from '@/types/admin/admin-dashboard';


const NotesTab = ({ notes }: NotesTabProps) => {
  return (
    <>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <NotebookTextIcon size={60} />
          <p className="mt-2">No recent notes found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recently added notes.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="font-medium">{note.title}</TableCell>
                <TableCell>{note.user.firstName} {note.user.lastName}</TableCell>
                <TableCell>{note.tag || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{note.status || "N/A"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={note.published ? "default" : "outline"}>
                    {note.published ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(note.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default NotesTab