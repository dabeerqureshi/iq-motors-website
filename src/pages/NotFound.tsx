import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Compass, Home, Car, Phone, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Page Not Found | IQ Motors Limited";
    console.warn(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    return () => {
      document.title = "IQ Motors Limited | Mercedes-Benz Specialists in Ealing, London";
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="w-16 h-16 bg-blue-50 text-cardealer-primary rounded-full flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>

          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-cardealer-primary">
              Error 404
            </span>
            <h1 className="text-3xl font-extrabold text-cardealer-dark mt-1">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              We couldn't find the page you're looking for. It may have been moved, renamed, or no longer exists.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button asChild className="w-full bg-cardealer-primary hover:bg-cardealer-secondary text-white gap-2 font-semibold">
              <Link to="/">
                <Home className="w-4 h-4" />
                Return to Home
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 gap-2">
              <Link to="/stock">
                <Car className="w-4 h-4" />
                Browse Mercedes Inventory
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="w-full text-gray-500 hover:text-gray-900 gap-1.5">
              <a href="tel:07877028198">
                <Phone className="w-4 h-4" />
                Contact Showroom: 07877 028198
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
