import React from "react";
import Image from "next/image";
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
import { BoxesIcon } from "lucide-react";
import { CollectionsTabProps } from "@/types/admin/admin-dashboard";


const CollectionsTab = ({ collections }: CollectionsTabProps) => {
  return (
    <>
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <BoxesIcon size={60} />
          <p className="mt-2">No recent collections found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recently added collections.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((collection) => (
              <TableRow key={collection.id}>
                <TableCell>
                  <Image
                    alt={collection.label}
                    src={collection.image}
                    height={60}
                    width={60}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {collection.label}
                </TableCell>
                <TableCell>{collection.category}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      collection.state === "Active" ? "default" : "secondary"
                    }
                  >
                    {collection.state}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(collection.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default CollectionsTab;
