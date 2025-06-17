
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-betting-bg">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex h-full w-full flex-col">
            {isMobile && (
              <div className="flex items-center gap-2 p-4 border-b border-gray-700">
                <SidebarTrigger className="text-white hover:bg-betting-card" />
                <h1 className="text-lg font-semibold text-white">Menu</h1>
              </div>
            )}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
