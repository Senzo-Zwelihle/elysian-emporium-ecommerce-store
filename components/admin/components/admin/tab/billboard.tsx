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
import { Image as ImageIcon } from "lucide-react"; 
import { BillboardsTabProps } from "@/types/admin/admin-dashboard";



const BillboardsTab = ({ billboards }: BillboardsTabProps) => {
  return (
    <>
      {billboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <ImageIcon size={60} />
          <p className="mt-2">No recent billboards found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recently added billboards.</TableCaption>
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
            {billboards.map((billboard) => (
              <TableRow key={billboard.id}>
                <TableCell>
                  <Image
                    alt={billboard.label}
                    src={billboard.image}
                    height={60}
                    width={90}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{billboard.label}</TableCell>
                <TableCell>{billboard.category}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      billboard.state === "Active" ? "default" : "secondary"
                    }
                  >
                    {billboard.state}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(billboard.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default BillboardsTab;
