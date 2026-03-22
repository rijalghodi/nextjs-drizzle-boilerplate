import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

export const LogoText = ({
  className,
  size = "default",
  short = false,
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
  short?: boolean;
}) => {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      {/* <Logo size={size} /> */}
      <span
        className={cn(
          "font-semibold uppercase",
          size === "sm" ? "text-[0.725rem]" : size === "default" ? "text-sm" : "text-base",
          "leading-normal font-bold"
        )}
      >
        {siteConfig.name}
      </span>
    </div>
  );
};
