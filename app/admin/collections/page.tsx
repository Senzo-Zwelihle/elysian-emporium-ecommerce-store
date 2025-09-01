import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "@/components/icons/plus";

import { fetchAllCollections } from "@/app/api/admin/collections";

import { columns } from "@/components/admin/collection/columns";
import { CollectionDataTable } from "@/components/admin/collection/data-table";

const CollectionsPage = async () => {
  noStore();
  const collections = await fetchAllCollections();
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
      <div className="flex items-center justify-between mb-5">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Collections
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href={"/admin/collections/create"}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      <CollectionDataTable columns={columns} data={collections} />
    </Container>
  );
};

export default CollectionsPage;
