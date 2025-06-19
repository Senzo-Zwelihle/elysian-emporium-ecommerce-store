import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminProviders } from "@/app/admin/providers/admin-providers";
import { SiteSidebar } from "@/components/admin/components/layout/site-sidebar";
import { SiteHeader } from "@/components/admin/components/layout/site-header";

export default async function AdminDashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const auth = process.env.AUTH;

  // check if the user is authenticated
  if (!user || user.email !== auth) {
    return redirect("/");
  }

  const fallback = {
    name: user.given_name ?? user.family_name ?? "Guest",
    email: user.email ?? "guest",
    avatar: user.picture ?? "https://avatar.vercel.sh",
  };

  return (
    <SidebarProvider>
      <SiteSidebar variant="sidebar" user={fallback} />
      <SidebarInset>
        <SiteHeader />
        <main>
          <AdminProviders>{children}</AdminProviders>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
