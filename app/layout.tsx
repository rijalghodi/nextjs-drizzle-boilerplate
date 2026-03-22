import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";
import { DialogManagerProvider } from "@/providers/dialog-providers";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipsProvider } from "@/providers/tooltips-provider";
import { DialogConfirm } from "@/components/ui/dialog-confirm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/css/styles.css";
import { siteConfig } from "@/config/site.config";

const sansFont = localFont({
  src: "./inter.woff2",
  variable: "--font-sans",
  weight: "100 900",
});
const monoFont = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | " + siteConfig.name,
    default: siteConfig.name,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          "antialiased flex h-full text-base text-foreground bg-background-app min-h-screen",
          sansFont.className,
          monoFont.variable
        )}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <DialogManagerProvider dialogs={{ confirm: DialogConfirm }}>
                <TooltipsProvider>
                  <NuqsAdapter>
                    <SidebarProvider>
                      <Suspense>{children}</Suspense>
                    </SidebarProvider>
                  </NuqsAdapter>
                  <Toaster />
                </TooltipsProvider>
              </DialogManagerProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
