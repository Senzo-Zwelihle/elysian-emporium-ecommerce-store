import React from "react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  EditIcon,
  FilePlus2Icon,
  GalleryVerticalEndIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
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
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/client/prisma";

async function fetchBrands() {
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      company: true,
      logo: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return brands;
}

const BrandsRoutePage = async () => {
  noStore();
  const brands = await fetchBrands();
  // console.log(brands);
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
          Brands
        </Heading>
        <Button
          effect="expandIcon"
          icon={FilePlus2Icon}
          iconPlacement="right"
          size={"store"}
        >
          <Link href={"/admin/brands/create-new"}>Create Brand</Link>
        </Button>
      </div>

      {/* notes data */}
      {brands.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading
            size={"sm"}
            font={"PolySansSlim"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"md"}
          >
            No Brands Found!...
          </Heading>
          <GalleryVerticalEndIcon size={80} />
        </div>
      ) : (
        <div className="my-6">
          <Table>
            <TableCaption>Most recent brands created.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Logo</TableHead>

                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.company}</TableCell>
                  <TableCell>
                    <Image
                      src={brand.logo}
                      alt={brand.company}
                      width={80}
                      height={80}
                    />
                  </TableCell>

                  <TableCell>
                    {new Intl.DateTimeFormat("en-US").format(brand.createdAt)}
                  </TableCell>
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
                          <EditIcon className=" mr-2" />
                          <Link href={`/admin/brands/${brand.id}/edit`}>
                            Edit Brand
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <TrashIcon className=" mr-2" />
                          <Link href={`/admin/brands/${brand.id}/delete`}>
                            Delete Brand
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

export default BrandsRoutePage;
