"use client";

import { ROUTES } from "@/config/routes.config";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/common/container";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { EditCurrentUserForm } from "./components/edit-current-user-form";

export default function MePage() {
  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarTitle>Akun Saya</ToolbarTitle>
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                href: ROUTES.DASHBOARD,
              },
              {
                label: "Akun Saya",
                href: ROUTES.ME,
              },
            ]}
          />
        </ToolbarHeading>
      </Toolbar>
      <EditCurrentUserForm className="max-w-xl" />
    </Container>
  );
}
