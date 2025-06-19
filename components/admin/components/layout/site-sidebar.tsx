"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileBoxIcon,
  FlameIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  LayoutListIcon,
  NotebookPenIcon,
  PackageOpenIcon,
  SettingsIcon,
  ShoppingBagIcon,
  SparklesIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ElysianEmporiumLogo from "@/public/brand/elysian-logo-square.svg";
import { SiteMain } from "@/components/admin/components/layout/site-main";
import { SiteUser } from "@/components/admin/components/layout/site-user";

const data = {
  navigationItems: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },

    {
      title: "Stores",
      url: "/admin/stores",
      icon: StoreIcon,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingBagIcon,
    },
    {
      title: "Brands",
      url: "/admin/brands",
      icon: LayoutListIcon,
    },
        {
      title: "Billboards",
      url: "/admin/billboards",
      icon: ImagesIcon,
    },
    {
      title: "Collections",
      url: "/admin/collections",
      icon: FlameIcon,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: PackageOpenIcon,
    },
    {
      title: "Documents",
      url: "/admin/documents",
      icon: FileBoxIcon,
    },
    {
      title: "Notes",
      url: "/admin/notes",
      icon: NotebookPenIcon,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: SparklesIcon,
    },

    {
      title: "Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
  ],
};
export function SiteSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <Image
                  src={ElysianEmporiumLogo}
                  alt="Elysian Emporium"
                  width={48}
                  height={48}
                  className="h-8 w-8 rounded-sm"
                  quality={100}
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Elysian Emporium</span>
                  <span className="">Production</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SiteMain items={data.navigationItems} />
      </SidebarContent>

      <SidebarFooter>
        <SiteUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
