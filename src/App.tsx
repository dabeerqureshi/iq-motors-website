import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-cardealer-primary focus:shadow-md focus:rounded-md focus:font-semibold focus:outline-none focus:ring-2 focus:ring-cardealer-primary"
            >
              Skip to main content
            </a>
            <ScrollToTop />
            <div id="main-content">
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
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
