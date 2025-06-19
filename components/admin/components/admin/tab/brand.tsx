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
import { CopyrightIcon } from "lucide-react";
import { BrandsTabProps } from "@/types/admin/admin-dashboard";


const BrandsTab = ({ brands }: BrandsTabProps) => {
  return (
     <>
      {brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <CopyrightIcon  size={60} />
          <p className="mt-2">No recent brands found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recently added brands.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  <Image
                    alt={brand.company}
                    src={brand.logo}
                    height={40}
                    width={40}
                    className="rounded-full w-9 h-9 object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{brand.company}</TableCell>
                <TableCell>
                  <Badge variant={brand.active ? "default" : "destructive"}>
                    {brand.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(brand.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

export default BrandsTab