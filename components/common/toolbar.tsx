import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ToolbarActionsProps {
  children?: ReactNode;
}

export interface ToolbarProps {
  children?: ReactNode;
  className?: string;
}

export interface ToolbarTitleProps {
  children: ReactNode;
  className?: string;
}

export interface ToolbarHeadingProps {
  className?: string;
  children: ReactNode;
}

export const Toolbar = ({ children, className }: ToolbarProps) => {
  return (
    <div className={cn("flex items-center justify-between grow gap-2.5 pb-5", className)}>
      {children}
    </div>
  );
};

export const ToolbarHeading = ({ children, className }: ToolbarHeadingProps) => {
  return <div className={cn("flex flex-col flex-wrap gap-2", className)}>{children}</div>;
};

export const ToolbarTitle = ({ className, children }: ToolbarTitleProps) => {
  return <h1 className={cn("font-semibold text-foreground text-xl", className)}>{children}</h1>;
};

export const ToolbarActions = ({ children }: ToolbarActionsProps) => {
  return (
    <div className="flex items-center flex-wrap justify-end gap-1.5 lg:gap-3.5">{children}</div>
  );
};
