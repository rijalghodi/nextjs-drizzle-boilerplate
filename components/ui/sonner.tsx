"use client";

import { Check, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Spinner } from "./spinner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      position="top-center"
      icons={{
        success: <Check className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Spinner className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--success-soft, var(--color-green-50))",
          "--success-text": "var(--success, var(--color-green-950))",
          "--success-border": "var(--success-soft)",
          "--error-bg": "var(--destructive-soft, var(--color-red-50))",
          "--error-text": "var(--destructive, var(--color-red-950))",
          "--error-border": "var(--destructive-soft)",
          "--warning-bg": "var(--warning-soft, var(--color-yellow-50))",
          "--warning-text": "var(--warning, var(--color-yellow-950))",
          "--warning-border": "var(--warning-soft)",
          "--info-bg": "var(--info-soft, var(--color-blue-50))",
          "--info-text": "var(--info, var(--color-blue-950))",
          "--info-border": "var(--info-soft)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
