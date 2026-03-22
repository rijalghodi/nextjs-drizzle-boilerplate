"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const AccountingTableRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { minWidth?: string | number }
>(({ className, children, minWidth, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-xl relative overflow-x-auto overflow-y-auto w-full flex-1",
      className
    )}
    {...props}
  >
    <table className="w-full border-collapse" style={{ minWidth }}>
      {children}
    </table>
  </div>
));
AccountingTableRoot.displayName = "AccountingTableRoot";

const AccountingTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("sticky top-0 z-30 shadow-sm border-b border-border", className)}
    {...props}
  />
));
AccountingTableHeader.displayName = "AccountingTableHeader";

const AccountingTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("divide-y divide-border/40", className)} {...props} />
));
AccountingTableBody.displayName = "AccountingTableBody";

const AccountingTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "sticky bottom-0 z-30 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] border-t border-border mt-2",
      className
    )}
    {...props}
  />
));
AccountingTableFooter.displayName = "AccountingTableFooter";

const AccountingTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    variant?: "section" | "subheader" | "subtotal" | "account" | "spacer" | "default";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    section: "bg-muted",
    subheader: "bg-card",
    subtotal: "bg-card group",
    account: "bg-card group transition-colors",
    spacer: "",
    default: "bg-card",
  };

  return (
    <tr
      ref={ref}
      className={cn(variants[variant], variant !== "spacer" && "hover:bg-muted", className)}
      {...props}
    />
  );
});
AccountingTableRow.displayName = "AccountingTableRow";

const AccountingTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    isHeaderColumn?: boolean;
    isHeader?: boolean;
    align?: "left" | "right" | "center";
    variant?: "section" | "subheader" | "subtotal" | "account" | "default";
    indent?: number;
  }
>(
  (
    {
      className,
      isHeaderColumn,
      isHeader,
      align = "left",
      variant = "default",
      indent = 0,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Component = isHeader ? "th" : "td";

    const paddingLeft = indent > 0 ? indent * 20 + 16 : undefined;

    const baseClasses = isHeader
      ? "px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
      : cn(
          "relative px-4 py-2 transition-colors",
          variant === "section" && "py-3 text-sm font-bold tracking-wide uppercase",
          variant === "subheader" && "text-sm font-semibold text-foreground",
          variant === "subtotal" && "py-2.5 text-sm font-semibold text-foreground",
          variant === "subtotal" && isHeaderColumn && "italic",
          variant === "account" && "text-[14px]"
        );

    const stickyClasses = isHeaderColumn
      ? cn(
          "sticky left-0 z-10 border-r border-border/50",
          isHeader
            ? "z-40 bg-muted"
            : cn("bg-card group-hover:bg-muted", variant === "section" && "bg-muted")
        )
      : "";

    const alignmentClasses =
      align === "right" ? "text-right font-mono" : align === "center" ? "text-center" : "text-left";

    return (
      <Component
        ref={ref as any}
        className={cn(baseClasses, stickyClasses, alignmentClasses, className)}
        style={{
          paddingLeft: paddingLeft ?? (style as any)?.paddingLeft,
          ...style,
        }}
        {...props}
      >
        {children}
        {variant === "subtotal" && (
          <div
            className="absolute top-0 right-0 border-b border-dashed border-foreground/40"
            style={{
              left: isHeaderColumn ? (paddingLeft ?? 0) : 0,
              zIndex: isHeaderColumn ? 10 : 0,
            }}
          />
        )}
      </Component>
    );
  }
);
AccountingTableCell.displayName = "AccountingTableCell";

export {
  AccountingTableRoot,
  AccountingTableHeader,
  AccountingTableBody,
  AccountingTableFooter,
  AccountingTableRow,
  AccountingTableCell,
};
