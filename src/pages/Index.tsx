
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SurebetCalculator } from "@/components/surebet/SurebetCalculator";
import ApostaBoostedCalculator from "@/components/ApostaBoostedCalculator";

const Index = () => {
  const [currentView, setCurrentView] = useState<'boosted' | 'surebet'>('boosted');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onSurebetClick={() => setCurrentView('surebet')} />
        <main className="flex-1">
          <div className="p-4">
            <SidebarTrigger />
          </div>
          {currentView === 'boosted' && <ApostaBoostedCalculator />}
          {currentView === 'surebet' && <SurebetCalculator />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
