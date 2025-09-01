import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "@/components/icons/plus";

import { DataTable } from "@/components/admin/task/data-table";
import { columns } from "@/components/admin/task/columns";

import { fetchAllTasks } from "@/app/api/admin/task";

const TasksPage = async () => {
  noStore();
  const tasks = await fetchAllTasks();

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="tasks"
      className="my-4"
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
          Tasks
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href={"/admin/documents/tasks/create"}>Create Task</Link>
        </Button>
      </div>

      {/* main */}
      <DataTable data={tasks} columns={columns} />
    </Container>
  );
};

export default TasksPage;
