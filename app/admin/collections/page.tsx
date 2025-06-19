import React from "react";
import Image from "next/image";
import {
  EditIcon,
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

async function fetchCollections() {
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      label: true,
      description: true,
      color: true,
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

  return collections;
}

const CollectionsRoutePage = async () => {
  noStore();
  const collections = await fetchCollections();
  // console.log(collections);
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
          Collections
        </Heading>
        <Button
          effect="expandIcon"
          icon={FilePlus2Icon}
          iconPlacement="right"
          size={"store"}
        >
          <Link href={"/admin/collections/create-new"}>Create Collection</Link>
        </Button>
      </div>
      {/* collection data */}
      <div>
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-40">
            <Heading
              size={"sm"}
              font={"PolySansSlim"}
              spacing={"normal"}
              lineHeight={"none"}
              margin={"md"}
            >
              No Collections Found!
            </Heading>
            <GalleryHorizontalEndIcon size={80} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-3 lg:grid-cols-4 mx-auto">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md transition-all hover:shadow-md cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative flex items-center justify-center">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.label}
                    width={200}
                    height={200}
                    quality={95}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute left-2 top-2 text-white">
                    {collection.category}
                  </Badge>
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="text-xl font-bold truncate">
                    {collection.label}
                  </h3>
                  {collection.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {collection.description}
                    </p>
                  )}
                  {collection.url && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {collection.url}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {new Intl.DateTimeFormat("en-US").format(
                      collection.createdAt
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
                          <EditIcon />
                          <Link
                            href={`/admin/collections/${collection.id}/edit`}
                          >
                            Edit Collection
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <TrashIcon />
                          <Link
                            href={`/admin/collections/${collection.id}/delete`}
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

export default CollectionsRoutePage;
