
import { Calculator, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Calculadora de Cashback",
    url: "/",
    icon: Calculator,
  },
  {
    title: "Aposta Boosted (21 Mai 2025)",
    url: "/aposta-boosted",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-700">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/5e1707b4-b5b7-4fc6-8e0c-662fa09b2102.png" 
            alt="Renda Fixa" 
            className="w-8 h-8"
          />
          <div>
            <h2 className="text-lg font-bold text-white">Renda Fixa</h2>
            <p className="text-sm text-gray-400">Calculadoras</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-400">Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="text-white hover:bg-betting-card hover:text-yellow-400 data-[active=true]:bg-betting-card data-[active=true]:text-yellow-400"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
