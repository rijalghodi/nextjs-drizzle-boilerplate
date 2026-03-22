"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";
import { useSession } from "next-auth/react";
import {
  MENU_SIDEBAR_ADMIN,
  MENU_SIDEBAR_GUEST,
} from "@/config/menu.config";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/logos/logo";
import { LogoText } from "@/components/logos/logo-text";

// ─── Types ───────────────────────────────────────────────────────────────────

type MenuItem = { title: string; icon: React.ElementType; path: string };
type MenuHeading = { heading: string; hidden?: boolean };
type MenuEntry = MenuItem | MenuHeading;

type MenuSection = {
  heading: string;
  hidden?: boolean;
  items: MenuItem[];
};

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Converts flat MenuConfig array into grouped sections */
function groupMenu(entries: MenuEntry[]): MenuSection[] {
  const sections: MenuSection[] = [];
  let current: MenuSection = { heading: "", items: [] };

  for (const entry of entries) {
    if ("heading" in entry) {
      if (current.items.length > 0 || sections.length === 0) {
        sections.push(current);
      }
      current = { heading: entry.heading, hidden: entry.hidden, items: [] };
    } else {
      current.items.push(entry as MenuItem);
    }
  }

  // Push last section
  if (current.items.length > 0) {
    sections.push(current);
  }

  return sections;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AppSidebar() {
  const { data: session, status } = useSession();

  const userRole = session?.user?.role || "";
  const pathname = usePathname();
  const { open, setOpenMobile } = useSidebar();

  const sections = useMemo(() => {
    let entries: MenuEntry[];
    switch (userRole) {
      case UserRole.ADMIN:
        entries = MENU_SIDEBAR_ADMIN;
        break;
      case UserRole.USER:
        entries = MENU_SIDEBAR_GUEST;
        break;
      default:
        entries = [];
    }
    return groupMenu(entries);
  }, [userRole]);

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname]);

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {status === "loading" ? (
        <SidebarLoading />
      ) : (
        <>
          <SidebarHeader>
            <SidebarMenu>
              <div className="flex items-center justify-between gap-2 px-1 py-1">
                {open && (
                  <div className="flex items-center gap-2">
                    <LogoText size="default" />
                  </div>
                )}
                <SidebarTrigger title="Toggle Sidebar" className="size-9 rounded-full" />
              </div>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {sections.map((section, idx) => (
              <SidebarGroup key={idx}>
                {/* Only render the label if heading text is non-empty and not hidden */}
                {section.heading && !section.hidden && (
                  <SidebarGroupLabel>{section.heading}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)
                          }
                          title={item.title}
                        >
                          <Link href={item.path}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </>
      )}
    </Sidebar>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SidebarLoading() {
  return (
    <SidebarContent className="flex flex-col gap-3 py-8 px-3">
      <Skeleton className="h-10 bg-sidebar-accent" />
      <Skeleton className="h-10 bg-sidebar-accent" />
      <Skeleton className="h-10 bg-sidebar-accent" />
      <Skeleton className="h-10 bg-sidebar-accent" />
      <Skeleton className="h-10 bg-sidebar-accent" />
    </SidebarContent>
  );
}
