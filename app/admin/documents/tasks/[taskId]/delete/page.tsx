import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

import { prisma } from "@/lib/prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

import { DeleteButton } from "@/components/ui/delete";

import { deleteTaskAction } from "@/server/actions/admin/task";

type Params = Promise<{ taskId: string }>;

const DeleteTaskForm = async ({ params }: { params: Params }) => {
  noStore();
  const { taskId } = await params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      title: true,
      status: true,
      updatedAt: true,
    },
  });

  if (!task) {
    return (
      <Container>
        <Card className="max-w-lg mx-auto w-full my-40 bg-background">
          <CardHeader>
            <CardTitle>Task not found</CardTitle>
            <CardDescription>
              The task you are trying to delete does not exist.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button asChild variant="ghost">
              <Link href="/admin/documents/tasks">Back to Tasks</Link>
            </Button>
          </CardFooter>
        </Card>
      </Container>
    );
  }

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="delete-task"
      className="my-4"
    >
      <div className="max-w-lg mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20 mx-auto w-fit mb-6">
            <AlertTriangleIcon className="h-10 w-10 text-destructive" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              Delete task
            </h1>
            {/* Warning  */}
            <div className="mt-8 p-4 rounded-xl border">
              <div className="flex gap-3">
                <AlertTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <strong className="font-medium">Warning:</strong> This action
                  is irreversible. Make sure you have a backup if you need to
                  restore this task later.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg leading-tight mb-2 break-words">
                  {task.title}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-4">
                    <span>
                      Status: <span className="font-medium">{task.status}</span>
                    </span>
                  </div>
                  <div>
                    Last updated:{" "}
                    <span className="font-medium">
                      {new Date(task.updatedAt).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-start space-x-2 mb-6">
          <input
            type="checkbox"
            id="confirm-delete"
            required
            className="peer mt-1"
          />
          <label
            htmlFor="confirm-delete"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            I understand that deleting this task is irreversible and cannot be
            undone.
          </label>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/documents/tasks">Cancel</Link>
          </Button>

          <form
            action={async () => {
              "use server";
              await deleteTaskAction(taskId);
              redirect("/admin/documents/tasks");
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </div>
      </div>
    </Container>
  );
};

export default DeleteTaskForm;
