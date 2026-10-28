import { useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerCard from "@/components/CustomerCard";
import { useHappyCustomers } from "@/hooks/useHappyCustomers";
import { Star } from "lucide-react";

const HappyCustomers = () => {
  const { customers: dbCustomers, loading, error } = useHappyCustomers();

  useEffect(() => {
    document.title = "Happy Customers & Handover Moments | IQ Motors Limited";
    return () => {
      document.title = "IQ Motors Limited | Mercedes-Benz Specialists in Ealing, London";
    };
  }, []);

  const allCustomers = useMemo(() => {
    return dbCustomers.map((customer, index) => ({
      id: customer.id,
      name: `Happy Customer ${index + 1}`,
      testimonial: "Thank you for the excellent service and quality vehicles!",
      imageUrl: customer.image_url,
      carPurchased: "Mercedes-Benz Vehicle",
    }));
  }, [dbCustomers]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-300 mb-2">
              <Star className="w-4 h-4 fill-amber-300" />
              <Star className="w-4 h-4 fill-amber-300" />
              <Star className="w-4 h-4 fill-amber-300" />
              <Star className="w-4 h-4 fill-amber-300" />
              <Star className="w-4 h-4 fill-amber-300" />
              <span className="text-white text-xs font-semibold ml-1">Autotrader Highly Rated 2024</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Happy Customers</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">
              Our customers love their Mercedes-Benz vehicles from IQ Motors. Here are genuine handover moments with their new cars.
            </p>
          </div>
        </div>

        <section className="py-16 bg-gray-50/50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-gray-600 max-w-md mx-auto">
                Customer gallery is updating. Please check back shortly.
              </div>
            ) : allCustomers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allCustomers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Customer photos coming soon.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HappyCustomers;
