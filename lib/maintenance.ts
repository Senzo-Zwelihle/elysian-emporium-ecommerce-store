import { prisma } from "@/lib/prisma/client";

export async function isMaintenanceModeEnabled(): Promise<boolean> {
  try {
    const maintenance = await prisma.maintenanceMode.findUnique({
      where: { id: "default" },
    });
    
    return maintenance?.enabled ?? false;
  } catch (error) {
    return false;
  }
}

export async function getMaintenanceMessage(): Promise<string> {
  try {
    const maintenance = await prisma.maintenanceMode.findUnique({
      where: { id: "default" },
    });
    
    return maintenance?.message ?? "We are currently performing scheduled maintenance. Please check back soon.";
  } catch (error) {
    return "We are currently performing scheduled maintenance. Please check back soon.";
  }
}