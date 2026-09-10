import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import StockList from "./pages/StockList";
import SoldCars from "./pages/SoldCars";
import HappyCustomers from "./pages/HappyCustomers";
import Finance from "./pages/Finance";
import Servicing from "./pages/Servicing";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CarDetail from "./pages/CarDetail";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stock" element={<StockList />} />
            <Route path="/sold" element={<SoldCars />} />
            <Route path="/customers" element={<HappyCustomers />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/servicing" element={<Servicing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/car/:id" element={<CarDetail />} />
            <Route path="/admin-IQmotors" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
