import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactLenis } from "@/components/providers/lenis-provider";
import { EdgeStoreProvider } from "@/components/providers/edgestore";

const PolySans = localFont({
  src: "./font/PolySans-Neutral.woff2",
  variable: "--font-PolySans",
  weight: "100 900",
});
const PolySansSlim = localFont({
  src: "./font/PolySans-Slim.woff2",
  variable: "--font-PolySans-Slim",
  weight: "100 900",
});
const PolySansBulky = localFont({
  src: "./font/PolySans-Bulky.woff2",
  variable: "--font-PolySans-Bulky",
  weight: "100 900",
});
const PolySansMedian = localFont({
  src: "./font/PolySans-Median.woff2",
  variable: "--font-PolySans-Median",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Elysian Emporium Ecommerce",
  description: "Modern ecommerce application built with Next.js",
  icons: {
    icon: "/favicon/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.03,
        duration: 2,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${PolySans.variable} ${PolySansSlim.variable} ${PolySansBulky.variable} ${PolySansMedian.variable} font-[family-name:var(--font-PolySans)]  selection:bg-ultramarine-700 selection:text-white antialiased`}
        >
          <EdgeStoreProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {/* upload thing config */}
              <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
              <Toaster />
            </ThemeProvider>
          </EdgeStoreProvider>
        </body>
      </html>
    </ReactLenis>
  );
}
