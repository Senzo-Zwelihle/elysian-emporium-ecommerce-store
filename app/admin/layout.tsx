import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavigationHeader from "@/components/admin/layout/navigation-header";
import AppSidebar from "@/components/admin/layout/app-sidebar";
import { CookieConsent } from "@/components/ui/cookie-consent";

const AdminDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // check user role
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "administrator") {
    redirect("/unauthorized");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavigationHeader />
        <main>{children}</main>
        <CookieConsent 
          variant="mini"
          description="We use cookies to enhance your admin experience and analyze site usage."
          learnMoreHref="/cookies"
        />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboardLayout;
