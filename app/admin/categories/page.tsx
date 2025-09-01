import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "@/components/icons/plus";

import { CategoryDataTable } from "@/components/admin/category/data-table";
import { categoryColumns } from "@/components/admin/category/columns";

import { fetchAllCategories } from "@/app/api/admin/category";

const CategoriesPage = async () => {
  noStore();
  const categories = await fetchAllCategories();
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
          Categories
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href={"/admin/categories/create"}>Create New</Link>
        </Button>
      </div>

      {/* main */}
      <CategoryDataTable data={categories} columns={categoryColumns} />
    </Container>
  );
};

export default CategoriesPage;
