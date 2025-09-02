"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

import { ApiResponse } from "@/types/api/response";
import { maintenanceSchema, MaintenanceSchemaType } from "@/schemas/admin/settings";

export async function updateMaintenanceModeAction(
  data: MaintenanceSchemaType
): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { status: "error", message: "Authentication required." };
  }

  if (session.user.role !== "administrator" && session.user.role !== "owner") {
    return { status: "error", message: "Unauthorized action." };
  }

  try {
    const result = maintenanceSchema.safeParse(data);
    if (!result.success) {
      return { status: "error", message: "Invalid data provided." };
    }

    await prisma.maintenanceMode.upsert({
      where: { id: "default" },
      update: {
        enabled: result.data.enabled,
        message: result.data.message,
      },
      create: {
        id: "default",
        enabled: result.data.enabled,
        message: result.data.message,
      },
    });

    revalidatePath("/admin/settings");

    return { 
      status: "success", 
      message: `Maintenance mode ${result.data.enabled ? "enabled" : "disabled"}` 
    };
  } catch (error) {
    return { 
      status: "error", 
      message: "Failed to update maintenance mode" 
    };
  }
}

export async function getMaintenanceModeAction(): Promise<{ enabled: boolean; message?: string }> {
  try {
    const maintenance = await prisma.maintenanceMode.findUnique({
      where: { id: "default" },
    });

    return {
      enabled: maintenance?.enabled ?? false,
      message: maintenance?.message ?? undefined,
    };
  } catch (error) {
    return { enabled: false };
  }
}