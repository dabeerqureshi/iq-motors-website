import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { useStockList } from "@/hooks/useStockList";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { useSeo, pageSeo } from "@/lib/seo";

const SoldCars = () => {
  const { soldCars, soldLoading: loading, soldError: error } = useStockList();

  useSeo(pageSeo("/sold"));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-cardealer-primary text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm font-semibold tracking-wider text-blue-200 uppercase bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30 inline-block mb-3">
              Sales Archive
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Recently Sold Vehicles
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">
              Browse examples of Mercedes-Benz vehicles recently delivered to happy drivers across London and the UK.
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="py-16 bg-gray-50/50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-xl bg-white border p-4 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="h-48 bg-gray-200 rounded-lg" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-gray-600 py-12 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Notice
                </h3>
                <p className="text-sm mb-4">
                  Please check back shortly or call our showroom directly on{" "}
                  <a href="tel:+447877028198" className="font-semibold text-cardealer-primary hover:underline">
                    07877 028198
                  </a>
                  .
                </p>
              </div>
            ) : soldCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {soldCars.map((car, index) => (
                  <AnimatedSection key={car.id} delay={(index % 3) * 120}>
                    <CarCard car={car} linkTo={`/car/${car.id}`} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border p-8 max-w-md mx-auto space-y-4">
                <h3 className="text-2xl font-bold text-cardealer-dark">
                  No Recently Sold Vehicles Listed
                </h3>
                <p className="text-gray-600 text-sm">
                  Our sold vehicle archive is currently being updated. Browse our available inventory to see vehicles currently in stock.
                </p>
                <Button asChild className="bg-cardealer-primary hover:bg-cardealer-secondary">
                  <Link to="/stock">View Available Stock</Link>
                </Button>
              </div>
            )}

            <div className="mt-16 text-center bg-white border rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
              <h3 className="text-2xl font-bold text-cardealer-dark mb-2">Looking for a Specific Model?</h3>
              <p className="text-gray-600 text-sm mb-6">
                If you have a particular Mercedes-Benz specification or budget in mind, let our sourcing team locate it for you.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild className="bg-cardealer-primary hover:bg-cardealer-secondary gap-2">
                  <Link to="/contact?enquiry=sourcing">
                    Request Vehicle Sourcing
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="tel:+447877028198">
                    <Phone className="w-4 h-4 mr-2" />
                    Call 07877 028198
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SoldCars;
