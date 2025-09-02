"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

import { ApiResponse } from "@/types/api/response";
import { adminSettingsSchema, AdminSettingsSchemaType } from "@/schemas/admin/settings";

export async function updateAdminSettingsAction(
  data: AdminSettingsSchemaType
): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { status: "error", message: "Authentication required." };
  }

  if (session.user.role !== "administrator" && session.user.role !== "owner") {
    return { status: "error", message: "Unauthorized action." };
  }

  try {
    const result = adminSettingsSchema.safeParse(data);
    if (!result.success) {
      return { status: "error", message: "Invalid form data" };
    }

    await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: result.data,
      create: {
        id: "default",
        ...result.data,
      },
    });

    revalidatePath("/admin/settings");

    return { status: "success", message: "Settings Updated Successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to update settings" };
  }
}

export async function getAdminSettingsAction(): Promise<AdminSettingsSchemaType> {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return {
        siteName: "Elysian Emporium",
        siteDescription: "A modern ecommerce platform",
        contactEmail: "support@elysianemporium.com",
        maintenanceMessage: "We are currently performing scheduled maintenance. Please check back soon.",
        userRegistration: true,
        emailNotifications: true,
        twoFactorAuth: false,
        loginAttemptLimit: true,
      };
    }

    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription ?? undefined,
      contactEmail: settings.contactEmail,
      maintenanceMessage: settings.maintenanceMessage ?? undefined,
      userRegistration: settings.userRegistration,
      emailNotifications: settings.emailNotifications,
      twoFactorAuth: settings.twoFactorAuth,
      loginAttemptLimit: settings.loginAttemptLimit,
    };
  } catch (error) {
    return {
      siteName: "Elysian Emporium",
      siteDescription: "A modern ecommerce platform",
      contactEmail: "support@elysianemporium.com",
      maintenanceMessage: "We are currently performing scheduled maintenance. Please check back soon.",
      userRegistration: true,
      emailNotifications: true,
      twoFactorAuth: false,
      loginAttemptLimit: true,
    };
  }
}
