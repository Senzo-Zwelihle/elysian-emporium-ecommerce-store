import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import { Toaster } from "@/components/ui/sonner";
import { ReactLenis } from "@/components/providers/lenis-provider";
import { NextThemeProvider } from "@/components/providers/next-themes-provider";
import { EdgeStoreProvider } from "@/components/providers/edgestore-provider";

export const metadata: Metadata = {
  title: "Elysian Emporium Ecommerce",
  description:
    "Discover high-quality, trendy, and sustainable products at Elysian Emporium. Your go-to online store for modern apparel, electronics, and home goods. Experience a seamless shopping experience with Next.js.",
  keywords: [
    "online store",
    "ecommerce",
    "modern apparel",
    "electronics",
    "home goods",
    "trendy fashion",
    "sustainable products",
    "South African",
    "Next.js",
  ],
  authors: [{ name: "Senzo Masango" }],
  icons: {
    icon: "/assets/favicon/favicon-light.svg",
    shortcut: "/assets/favicon/favicon-light.svg",
    apple: "/assets/favicon/favicon-dark.svg",
  },
};

const aeonikBold = localFont({
  src: "./fonts/Aeonik-Bold.otf",
  variable: "--font-aeonikBold",
  display: "swap",
});

const aeonikLight = localFont({
  src: "./fonts/Aeonik-Light.otf",
  variable: "--font-aeonikLight",
  display: "swap",
});

const aeonik = localFont({
  src: "./fonts/Aeonik-Regular.otf",
  variable: "--font-aeonik",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 3,
        wheelMultiplier: 0.5,
        touchMultiplier: 1,
        smoothWheel: true,
      }}
    >
      <html suppressHydrationWarning lang="en">
        <body
          className={`${aeonik.variable} ${aeonikLight.variable} ${aeonikBold.variable} antialiased font-sans selection:bg-ultramarine-700 selection:text-white`}
        >
          <EdgeStoreProvider>
            <NextThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <Toaster theme="system" />
              {children}
            </NextThemeProvider>
          </EdgeStoreProvider>
        </body>
      </html>
    </ReactLenis>
  );
}
