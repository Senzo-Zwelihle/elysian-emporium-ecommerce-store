import { prisma } from "@/lib/prisma/client";

async function initializeSettings() {
  try {
    // Initialize system settings
    await prisma.systemSettings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        siteName: "Elysian Emporium",
        siteDescription: "A modern ecommerce platform",
        contactEmail: "support@elysianemporium.com",
        maintenanceMessage: "We are currently performing scheduled maintenance. Please check back soon.",
        userRegistration: true,
        emailNotifications: true,
        twoFactorAuth: false,
        loginAttemptLimit: true,
      },
    });

    // Initialize maintenance mode
    await prisma.maintenanceMode.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        enabled: false,
        message: "We are currently performing scheduled maintenance. Please check back soon.",
      },
    });

    console.log("✅ Settings initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize settings:", error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeSettings();