import { Metadata } from "next";
import { ROUTES } from "@/config/routes.config";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/common/container";
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";
import { UserDashboard } from "./components/user-dashboard";

export const metadata: Metadata = {
  title: "Pengguna",
};

export default function Page() {
  return (
    <>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarTitle>Pengguna</ToolbarTitle>
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  href: ROUTES.DASHBOARD,
                },
                {
                  label: "Pengguna",
                  href: ROUTES.USERS,
                },
              ]}
            />
          </ToolbarHeading>
          <ToolbarActions></ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <UserDashboard />
      </Container>
    </>
  );
}
