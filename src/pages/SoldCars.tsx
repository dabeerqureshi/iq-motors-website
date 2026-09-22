import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { useStockList } from "@/hooks/useStockList";
import AnimatedSection from "@/components/AnimatedSection";
import { useSeo, pageSeo } from "@/lib/seo";

const SoldCars = () => {
  const { soldCars, soldLoading: loading, soldError: error } = useStockList();

  useSeo(pageSeo("/sold"));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-cardealer-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Recently Sold Mercedes-Benz
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Take a look at some of the Mercedes-Benz vehicles we've helped our
              customers find recently.
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-lg bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-gray-600 py-12">
                <h3 className="text-xl font-bold text-gray-500 mb-2">
                  We're having trouble loading our recent sales
                </h3>
                <p>
                  Please check back shortly or call us on{" "}
                  <a href="tel:+447877028198" className="font-semibold hover:underline">
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
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-500 mb-4">
                  No Recently Sold Mercedes-Benz
                </h3>
                <p className="text-gray-600">
                  Please check back soon for updates on our most recent sales.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SoldCars;
