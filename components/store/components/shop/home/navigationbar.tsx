import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { HeartIcon, ShoppingBagIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserMenuDropdown from "@/components/store/components/user/user-dropdown";
import { ShoppingCart } from "@/types/store/shopping-cart";
import { redis } from "@/redis/cart/cart-db";
import {
  navigationMenu,
  navigationMenuItems,
} from "@/constants/store/navigation";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { MenuIcon } from "@/components/svg/motion/menu";
import ElysianEmporiumLogo from "@/public/brand/elysian-logo-square.svg";

const Navigationbar = async () => {
  // check if the user is authenticated and has a session
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const authenticated = await isAuthenticated();

  // shopping cart
  const cart: ShoppingCart | null = await redis.get(`cart-${user?.id}`);
  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  return (
    <header className="sticky top-0 z-50 w-full mx-auto px-6 md:px-6 xl:px-6 backdrop-blur-sm bg-background/80 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        {/* logo */}
        <div className="flex items-center gap-2 font-bold">
          <Image
            src={ElysianEmporiumLogo}
            height={36}
            width={36}
            quality={95}
            alt="Elysian Emporium Logo"
            className="rounded-sm"
          />
        </div>
        {/* menubar */}
        <Menubar className="hidden md:flex gap-4 border-none shadow-none ">
          {navigationMenuItems.map((item) => (
            <MenubarMenu key={item.label}>
              <MenubarTrigger asChild>
                {item.children ? (
                  <button className="text-md font-[family-name:var(--font-PolySans-Slim)] px-2 py-1">
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.target}
                    className="text-md font-[family-name:var(--font-PolySans-Slim)] px-2 py-1"
                  >
                    {item.label}
                  </Link>
                )}
              </MenubarTrigger>

              {item.children && (
                <MenubarContent>
                  {item.children.map((child) => (
                    <MenubarItem key={child.label} asChild>
                      <Link href={child.target}>{child.label}</Link>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              )}
            </MenubarMenu>
          ))}
        </Menubar>
        {/* end content */}
        <div className="hidden md:flex gap-2 items-center">
          {/* theme switcher - favorites - bag -etc */}
          <ThemeSwitcher />
          {/* favorites icon */}
          <div>
            <Link href={"/account/favorites"} className="cursor-pointer">
              <Button
                variant={"outline"}
                size={"icon"}
                className="rounded-full bg-tall-poppy-600 hover:bg-tall-poppy-600/90"
              >
                <HeartIcon fill="white" color="white" />
              </Button>
            </Link>
          </div>
          {/* shoppingbag icon */}
          <div className="relative">
            <Link href={"/account/cart"} className="cursor-pointer">
              <Button
                variant={"outline"}
                size={"icon"}
                className="rounded-full"
              >
                <Badge className="bg-destructive h-5 min-w-5 rounded-full px-1  tabular-nums absolute top-0 right-0 grid justify-center items-center translate-x-1 -translate-y-1">
                  {total}
                </Badge>
                <ShoppingBagIcon />
              </Button>
            </Link>
          </div>

          {/* the user doesnt have an account or session */}
          {!authenticated && (
            <>
              <Button variant={"ghost"} size={"store"}>
                <LoginLink>Sign in </LoginLink>
              </Button>
            </>
          )}
          {/* if there is a session and user is authenticated display content */}
          {authenticated && (
            <>
              {/* user shopping bag */}

              {/* user down */}
              <UserMenuDropdown
                user={{
                  name: user?.given_name ?? "Guest",
                  email: user?.email ?? "guest@example.com",
                  avatar: user?.picture ?? "https://avatar.vercel.sh",
                }}
              />
            </>
          )}
        </div>
        {/* mobile menu */}
        <div className="flex items-center gap-4 md:hidden">
          {/* theme switcher - favorites - bag -etc */}
          <div>
            {" "}
            <ThemeSwitcher />
          </div>
          {/* favorites icon */}
          <div>
            <Link href={"/account/favorites"} className="cursor-pointer">
              <Button
                variant={"outline"}
                size={"icon"}
                className="rounded-full bg-tall-poppy-600 hover:bg-tall-poppy-600/90"
              >
                <HeartIcon fill="white" color="white" />
              </Button>
            </Link>
          </div>
          {/* shoppingbag icon */}
          <div className="relative">
            <Link href={"/account/cart"} className="cursor-pointer">
              <Button
                variant={"outline"}
                size={"icon"}
                className="rounded-full"
              >
                <Badge className="bg-destructive h-5 min-w-5 rounded-full px-1  tabular-nums absolute top-0 right-0 grid justify-center items-center translate-x-1 -translate-y-1">
                  {total}
                </Badge>
                <ShoppingBagIcon />
              </Button>
            </Link>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size={"icon"} className="rounded-full">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <Image
                    src={ElysianEmporiumLogo}
                    height={30}
                    width={30}
                    quality={95}
                    alt="Elysian Emporium Logo Square"
                    className="rounded-sm"
                  />
                </SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              {/* navigationlinks */}
              <nav className="container p-4 py-4 flex flex-col gap-4">
                {navigationMenu.map((item) => (
                  <Link
                    key={item.label}
                    href={item.target}
                    className=" text-sm font-[family-name:var(--font-PolySans-Slim)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {!authenticated && (
                <>
                  <Button variant={"ghost"} size={"store"}>
                    <LoginLink>Sign in </LoginLink>
                  </Button>
                </>
              )}
              <div className="container p-4 py-2 flex flex-col gap-4">
                <UserMenuDropdown
                  user={{
                    name: user?.given_name ?? "Guest",
                    email: user?.email ?? "guest@example.com",
                    avatar: user?.picture ?? "https://avatar.vercel.sh",
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navigationbar;
