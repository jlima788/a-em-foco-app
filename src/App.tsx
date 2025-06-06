
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import SubscriptionGuard from "@/components/subscription/SubscriptionGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Success from "./pages/Success";
import ContasFixas from "./pages/ContasFixas";
import Ganhos from "./pages/Ganhos";
import CartoesCredito from "./pages/CartoesCredito";
import MuralSonhos from "./pages/MuralSonhos";
import Dividas from "./pages/Dividas";
import Investimentos from "./pages/Investimentos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/auth" 
            element={
              <AuthGuard requireAuth={false}>
                <Auth />
              </AuthGuard>
            } 
          />
          <Route 
            path="/success" 
            element={
              <AuthGuard requireAuth={true}>
                <Success />
              </AuthGuard>
            } 
          />
          <Route 
            path="/*" 
            element={
              <AuthGuard requireAuth={true}>
                <SubscriptionGuard>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/contas-fixas" element={<ContasFixas />} />
                          <Route path="/ganhos" element={<Ganhos />} />
                          <Route path="/cartoes-credito" element={<CartoesCredito />} />
                          <Route path="/mural-sonhos" element={<MuralSonhos />} />
                          <Route path="/dividas" element={<Dividas />} />
                          <Route path="/investimentos" element={<Investimentos />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </SidebarProvider>
                </SubscriptionGuard>
              </AuthGuard>
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
