"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";


import NavigationMain from "@/components/admin/layout/navigation-main";
import NavigationUser from "@/components/admin/layout/navigation-user";

import {
  CalendarIcon,
  CrownIcon,
  FlameIcon,
  GalleryThumbnailsIcon,
  GaugeIcon,
  HeartHandshakeIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LayoutListIcon,
  MapPinIcon,
  PackageOpenIcon,
  SettingsIcon,
  ShieldUserIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TablePropertiesIcon,
  UsersRoundIcon,
} from "lucide-react";

import ElysianEmporiumEcommerceLogo from "@/public/assets/brand/elysian-emporium-ecommerce-logo.svg";


// data

const data = {
  // placeholder
  user: {
    name: "user",
    email: "user@email.com",
    avatar: "/assets/placeholders/avatar-placeholder.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: GaugeIcon,
    },
    {
      title: "Organization",
      url: "/admin/organization",
      icon: ShieldUserIcon,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingBagIcon,
    },
    {
      title: "Warehouses",
      url: "/admin/warehouses",
      icon: MapPinIcon,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: PackageOpenIcon,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: TablePropertiesIcon,
    },
    {
      title: "Brands",
      url: "/admin/brands",
      icon: LayoutListIcon,
    },
    {
      title: "Collections",
      url: "/admin/collections",
      icon: FlameIcon,
    },
    {
      title: "Billboards",
      url: "/admin/billboards",
      icon: GalleryThumbnailsIcon,
    },
    {
      title: "Promotions",
      url: "/admin/promotions",
      icon: SparklesIcon,
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: CalendarIcon,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UsersRoundIcon,
    },
    {
      title: "Memberships",
      url: "/admin/memberships",
      icon: CrownIcon,
    },

    {
      title: "Feedback",
      url: "/admin/feedback",
      icon: HeartHandshakeIcon,
    },
    {
      title: "Documents",
      url: "/admin/documents",
      icon: LayersIcon,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: SettingsIcon,
    },
  ],
  navSecondary: [
    {
      title: "Documents",
      url: "/admin/documents",
      icon: LayersIcon,
      isActive: true,
      items: [
        {
          title: "Files",
          url: "/admin/documents/files",
        },
        {
          title: "Notes",
          url: "/admin/documents/notes",
        },
        {
          title: "Tasks",
          url: "/admin/documents/tasks",
        },
      ],
    },
  ],
};

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={ElysianEmporiumEcommerceLogo}
                    alt="Elysian Emporium Ecommerce Logo"
                    className="rounded-sm"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Elysian Emporium</span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* search */}

  
      </SidebarHeader>
      {/* content */}
      <SidebarContent>
        <NavigationMain items={data.navMain} />
        {/* <NavigationSecondary items={data.navSecondary} /> */}
      </SidebarContent>
      {/* user */}
      <SidebarFooter>
        <NavigationUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
