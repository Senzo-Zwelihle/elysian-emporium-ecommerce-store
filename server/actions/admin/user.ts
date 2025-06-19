"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { userZodSchema } from "@/schemas/admin/user";
import {
  MembershipLevel,
  UserAccountStatus,
  UserRole,
} from "@/lib/generated/prisma";

const auth = process.env.AUTH;

// edit user action - admin server action!!!!!

export async function editUserAction(
  userId: string,
  data: z.infer<typeof userZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit users.",
    };
  }

  try {
    const validated = userZodSchema.parse(data);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
        profileImage: validated.profileImage,
        role: validated.role as UserRole,
        status: validated.status as UserAccountStatus,
        membership: validated.membership as MembershipLevel,
      },
    });

    return {
      success: true,
      message: "User edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editUserAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the user.",
    };
  }
}

// delete
export async function deleteUserAction(userId: string) {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return redirect("/admin/users");
}
