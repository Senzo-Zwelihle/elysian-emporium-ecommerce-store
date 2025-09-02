"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

import { ApiResponse } from "@/types/api/response";

import { createNotificationAction } from "@/server/actions/notification/notifications";
import { NotificationType } from "@/lib/generated/prisma";

import { editUserSchema, EditUserSchemaType } from "@/schemas/admin/user";

export async function updateUserAction(
  data: EditUserSchemaType,
  userId: string
): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "administrator") {
    redirect("/unauthorized");
  }

  try {
    // schema validation
    const result = editUserSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    // mutation
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...result.data,
      },
    });

    await createNotificationAction(
      `Successfully updated user "${updatedUser.name}".`,
      NotificationType.success,
      updatedUser.id,
      "User",
      session.user.id
    );
    
    return {
      status: "success",
      message: "User Updated Successfully",
    };
  } catch (error) {
    await createNotificationAction(
      `Failed to update user. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    );
    return {
      status: "error",
      message: "Failed to update user, please try again.",
    };
  }
}