import { SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full">
      <AppSidebar />
      <SidebarInset className="flex flex-row overflow-auto min-h-0 min-w-0 bg-background-app">
        <div className="flex flex-col flex-1 min-h-0 min-w-0">
          <Header />
          <main className="flex-1 py-3 relative">{children}</main>
          <Footer />
        </div>
      </SidebarInset>
    </div>
  );
}

export default AppLayout;
