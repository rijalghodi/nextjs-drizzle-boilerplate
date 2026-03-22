"use client";

import { ReactNode } from "react";

export function SetupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-screen items-center justify-center">
      {/* <Header withLogo showSidebarTriggerOnMobile={false} /> */}
      <main className="mx-auto py-6">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
