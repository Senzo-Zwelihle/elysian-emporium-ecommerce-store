
import React from "react";
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
import { FileTextIcon } from "lucide-react";
import { DocumentsTabProps } from "@/types/admin/admin-dashboard";


const DocumentsTab = ({ documents }: DocumentsTabProps) => {
  return (
  <>
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <FileTextIcon size={60} />
          <p className="mt-2">No recent documents found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recently added documents.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>
                  <Badge variant="outline">{document.state}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={document.published ? "default" : "secondary"}>
                    {document.published ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>{document.user.firstName} {document.user.lastName}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(document.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default DocumentsTab