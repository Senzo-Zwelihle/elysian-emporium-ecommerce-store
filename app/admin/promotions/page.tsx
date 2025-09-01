import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, FilePenIcon, Trash2Icon } from "lucide-react";
import { GalleryHorizontalEndIcon } from "@/components/icons/gallery-horizontal-end";
import { PlusIcon } from "@/components/icons/plus";

import { fetchAllPromotions } from "@/app/api/admin/promotion";

const PromotionsPage = async () => {
  noStore();
  const promotions = await fetchAllPromotions();

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="promotions"
      className="my-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Promotions
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href="/admin/promotions/create">Create New</Link>
        </Button>
      </div>

      {/* Main */}
      <div>
        {promotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-40">
            <Heading
              size="sm"
              font="aeonik"
              spacing="normal"
              lineHeight="none"
              margin="md"
            >
              No Promotions Found!
            </Heading>
            <GalleryHorizontalEndIcon size={80} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-3 mx-auto">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="group relative overflow-hidden rounded-2xl border bg-background text-card-foreground shadow-md transition-all hover:shadow-md cursor-pointer py-0 gap-0"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative flex items-center justify-center">
                  <Image
                    src={promo.image || "/placeholder.svg"}
                    alt={promo.label}
                    width={400}
                    height={300}
                    quality={95}
                    className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="text-xl font-bold truncate">{promo.label}</h3>
                  {promo.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {promo.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {new Intl.DateTimeFormat("en-US").format(promo.createdAt)}
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
                          <Link href={`/admin/promotions/${promo.id}/update`}>
                            Update
                          </Link>
                          <FilePenIcon className="size-4 ml-1" />
                        </DropdownMenuItem>

                        <DropdownMenuItem variant="destructive">
                          <Link href={`/admin/promotions/${promo.id}/delete`}>
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

export default PromotionsPage;
