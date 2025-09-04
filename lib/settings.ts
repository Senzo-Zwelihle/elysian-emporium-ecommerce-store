import { prisma } from "@/lib/prisma/client";
import { AdminSettingsSchemaType } from "@/schemas/admin/settings";

export async function getSystemSettings(): Promise<AdminSettingsSchemaType> {
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
  } catch {
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

export async function getSiteName(): Promise<string> {
  const settings = await getSystemSettings();
  return settings.siteName;
}

export async function getContactEmail(): Promise<string> {
  const settings = await getSystemSettings();
  return settings.contactEmail;
}

export async function isUserRegistrationEnabled(): Promise<boolean> {
  const settings = await getSystemSettings();
  return settings.userRegistration ?? true;
}