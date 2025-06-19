import React from "react";
import Image from "next/image";
import {
  EditIcon,
  EyeIcon,
  FilePlus2Icon,
  GalleryHorizontalEndIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/client/prisma";

async function fetchBillboards() {
  const billboards = await prisma.billboard.findMany({
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      url: true,
      state: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return billboards;
}

const BillboardsRoutePage = async () => {
  noStore();
  const billboards = await fetchBillboards();
  // console.log(billboards);
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
          Billboards
        </Heading>
        <Button
          effect="expandIcon"
          icon={FilePlus2Icon}
          iconPlacement="right"
          size={"store"}
        >
          <Link href={"/admin/billboards/create-new"}>Create Billboard</Link>
        </Button>
      </div>
      {/* billboard data */}
      <div>
        {billboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-40">
            <Heading
              size={"sm"}
              font={"PolySansSlim"}
              spacing={"normal"}
              lineHeight={"none"}
              margin={"md"}
            >
              No Billboards Found!
            </Heading>
            <GalleryHorizontalEndIcon size={80} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-3 lg:grid-cols-4 mx-auto">
            {billboards.map((billboard) => (
              <div
                key={billboard.id}
                className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md transition-all hover:shadow-md cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative flex items-center justify-center">
                  <Image
                    src={billboard.image || "/placeholder.svg"}
                    alt={billboard.label}
                    width={400}
                    height={300}
                    quality={95}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute left-2 top-2 text-white">
                    {billboard.category}
                  </Badge>
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="text-xl font-bold truncate">
                    {billboard.label}
                  </h3>
                  {billboard.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {billboard.description}
                    </p>
                  )}
                  {billboard.url && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {billboard.url}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {new Intl.DateTimeFormat("en-US").format(
                      billboard.createdAt
                    )}
                  </p>

                  <div className="flex items-center justify-end space-x-4 mt-2">
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
                          <Link href={`/admin/billboards/${billboard.id}`}>
                            View Billboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <EditIcon />
                          <Link href={`/admin/billboards/${billboard.id}/edit`}>
                            Edit Billboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <TrashIcon  />
                          <Link
                            href={`/admin/billboards/${billboard.id}/delete`}
                          >
                            Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default BillboardsRoutePage;
