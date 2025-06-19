import React from "react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  EditIcon,
  EyeIcon,
  FilePlus2Icon,
  MoreHorizontalIcon,
  StoreIcon,
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

// Function to fetch all stores from the database
async function fetchStores() {
  noStore();
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      location: true,
      website: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return stores;
}

const StoresRoutePage = async () => {
  const stores = await fetchStores();

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
          Stores
        </Heading>
        <Button
          effect="expandIcon"
          icon={FilePlus2Icon}
          iconPlacement="right"
          size={"store"}
        >
          <Link href={"/admin/stores/create-new"}>Create Store</Link>
        </Button>
      </div>

      {stores.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading
            size={"sm"}
            font={"PolySansSlim"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"md"}
          >
            No Stores Found!...
          </Heading>
          <StoreIcon size={80} />
        </div>
      ) : (
        <div className="my-6">
          <Table>
            <TableCaption>Most recent stores created.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>
                    {store.logo && ( // Check if logo exists before rendering Image
                      <Image
                        src={store.logo}
                        alt={store.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>{store.location}</TableCell>
                  <TableCell>
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {store.website}
                    </a>
                  </TableCell>
                  <TableCell>{store.status}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US").format(store.createdAt)}
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
                          <EyeIcon className="mr-2" />
                          <Link href={`/admin/stores/${store.id}`}>
                            View Store
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/stores/${store.id}/edit`}>
                            <EditIcon className="mr-2 " />
                            Edit Store
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-coral-red-600">
                          <TrashIcon className=" mr-2" />
                          <Link href={`/admin/stores/${store.id}/delete`}>
                            Delete Store
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

export default StoresRoutePage;
