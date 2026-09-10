import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerCard from "@/components/CustomerCard";
// import { happyCustomers } from "@/data/customers";
import { useHappyCustomers } from "@/hooks/useHappyCustomers";
import { useMemo } from "react";

const HappyCustomers = () => {
  const { customers: dbCustomers, loading, error } = useHappyCustomers();

  // Combine database customers with static customers
  const allCustomers = useMemo(() => {
    // Convert database customers to match CustomerCard format
    const convertedDbCustomers = dbCustomers.map((customer, index) => ({
      id: customer.id,
      name: `Happy Customer ${index + 1}`, // Generic name since we only store image URL
      testimonial: "Thank you for the excellent service and quality vehicles!",
      imageUrl: customer.image_url,
      carPurchased: "Mercedes-Benz Vehicle",
    }));

    // Combine with static customers
    return [...convertedDbCustomers];
  }, [dbCustomers]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Happy Customers</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Our customers love their cars from IQ Motors. Here are some of our
              recent happy customers with their new vehicles.
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center">
                <div className="text-lg animate-pulse-slow text-gray-600">
                  Loading our happy customers...
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-gray-600">
                We're having trouble loading our happy customers right now.
                Please check back shortly.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allCustomers.map((customer) => (
                  <CustomerCard key={customer.id} customer={customer} />
                ))}
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
