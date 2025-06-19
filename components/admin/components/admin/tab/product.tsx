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
import { Package as PackageIcon } from "lucide-react";
import { ProductsTabProps } from "@/types/admin/admin-dashboard";



const ProductsTab = ({ products }: ProductsTabProps) => {
  return (
    <>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <PackageIcon size={60} />
          <p className="mt-2">No recent products found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your recently added products.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Date Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>R {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(product.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ProductsTab;
