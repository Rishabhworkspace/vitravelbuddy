import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CabBuddy from "./pages/CabBuddy";
import TripBuddy from "./pages/TripBuddy";
import OutingBuddy from "./pages/OutingBuddy";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Starfield from "./components/Starfield";
import Navigation from "./components/Navigation";
import Spaceship3D from "./components/Spaceship3D";
import FloatingPlanets from "./components/FloatingPlanets";
import ParallaxContainer from "./components/ParallaxContainer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Starfield />
        <FloatingPlanets />
        <Spaceship3D />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <ParallaxContainer>
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cabbuddy" element={<CabBuddy />} />
                <Route path="/tripbuddy" element={<TripBuddy />} />
                <Route path="/outingbuddy" element={<OutingBuddy />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </ParallaxContainer>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
