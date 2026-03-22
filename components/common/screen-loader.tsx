"use client";

import { Logo } from "../logos/logo";

export function ScreenLoader() {
  return (
    <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 transition-opacity duration-700 ease-in-out">
      <Logo size="lg" />
      <div className="text-muted-foreground font-medium text-sm">Loading...</div>
    </div>
  );
}
