"use client";

import { Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrentUser } from "@/hooks/users/use-current-user";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Container } from "@/components/common/container";
import { Logo } from "@/components/logos/logo";
import { LogoText } from "@/components/logos/logo-text";
import { UserDropdownMenu } from "./user-dropdown-menu";

export function Header({
  withLogo = false,
  showSidebarTriggerOnMobile = true,
}: {
  withLogo?: boolean;
  showSidebarTriggerOnMobile?: boolean;
}) {
  const isMobile = useIsMobile();
  const { data } = useCurrentUser();
  const user = data?.data;

  return (
    <header className={cn("py-3")}>
      <Container className="flex justify-between items-stretch lg:gap-4">
        {/* HeaderLogo */}
        {showSidebarTriggerOnMobile && (
          <div className="flex lg:hidden items-center gap-2.5">
            <SidebarTrigger asChild>
              <Button variant="ghost" mode="icon">
                <Menu className="text-foreground" />
              </Button>
            </SidebarTrigger>
          </div>
        )}

        {/* Main Content (MegaMenu or Breadcrumbs) */}

        <div className="flex items-center gap-2">
          {withLogo && (isMobile ? <Logo size="sm" /> : <LogoText size="sm" />)}
        </div>

        {/* HeaderTopbar */}
        <div className="flex items-center gap-3">
          <UserDropdownMenu
            trigger={
              user?.avatarFile?.url ? (
                <img
                  className="size-10 rounded-full border-2 border-primary shrink-0 cursor-pointer bg-background"
                  src={user.avatarFile.url}
                  alt="User Avatar"
                />
              ) : (
                <div className="size-10 rounded-full border-2 shrink-0 cursor-pointer flex items-center justify-center bg-background">
                  <User className="size-5" />
                </div>
              )
            }
          />
        </div>
      </Container>
    </header>
  );
}
