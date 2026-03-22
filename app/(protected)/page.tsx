import { Container } from "@/components/common/container";
import { Toolbar, ToolbarHeading, ToolbarTitle } from "@/components/common/toolbar";

export default function Page() {
  return (
    <Container>
      <Toolbar>
        <ToolbarHeading>
          <ToolbarTitle>Beranda</ToolbarTitle>
        </ToolbarHeading>
      </Toolbar>

      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground text-sm">
        Selamat datang di aplikasi.
      </div>
    </Container>
  );
}
