import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { FilePenIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "@/components/icons/plus";
import { GalleryHorizontalEndIcon } from "@/components/icons/gallery-horizontal-end";

import { fetchAllBillboards } from "@/app/api/admin/billboard";

const BillboardsPage = async () => {
  noStore();
  const billboards = await fetchAllBillboards();
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="tasks"
      className="my-4 space-y-4"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Billboards
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href={"/admin/billboards/create"}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      <div>
        {billboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-40">
            <Heading
              size={"sm"}
              font={"aeonik"}
              spacing={"normal"}
              lineHeight={"none"}
              margin={"md"}
            >
              No Billboards Found!
            </Heading>
            <GalleryHorizontalEndIcon size={80} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-3 mx-auto">
            {billboards.map((billboard) => (
              <div
                key={billboard.id}
                className="group relative overflow-hidden rounded-2xl border bg-background   text-card-foreground shadow-md transition-all hover:shadow-md cursor-pointer py-0 gap-0"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative flex items-center justify-center">
                  <Image
                    src={billboard.image || "/placeholder.svg"}
                    alt={billboard.label}
                    width={400}
                    height={300}
                    quality={95}
                    className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                  />
                  {/* <Badge className="absolute left-2 top-2 text-white">
                    {billboard.category}
                  </Badge> */}
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

                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {new Intl.DateTimeFormat("en-US").format(
                      billboard.createdAt
                    )}
                  </p>

                  <div className="flex items-center justify-end space-x-4 mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`/admin/billboards/${billboard.id}/update`}
                          >
                            Update
                          </Link>
                          <FilePenIcon className="size-4 ml-1" />
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Link
                            href={`/admin/billboards/${billboard.id}/delete`}
                          >
                            Delete
                          </Link>

                          <Trash2Icon className="size-4 ml-2" />
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

export default BillboardsPage;
