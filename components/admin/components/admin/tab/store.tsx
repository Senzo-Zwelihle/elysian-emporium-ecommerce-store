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
import { StoresTabProps } from "@/types/admin/admin-dashboard";



const StoresTab = ({ stores }: StoresTabProps) => {
  return (
    <>
      {stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <ImageIcon size={60} />
          <p className="mt-2">No recent stores found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recently added stores.</TableCaption>
          <TableHeader>
            <TableRow>
           
              <TableHead>Name</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>
                  <Image
                    alt={store.name}
                    src={store.logo}
                    height={40}
                    width={40}
                    className="rounded-xs object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{store.location}</TableCell>
              
                <TableCell>
                  <Badge
                    variant={
                      store.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {store.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(store.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default StoresTab;
