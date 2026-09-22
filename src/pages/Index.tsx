import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CarCard, { type Car } from "@/components/CarCard";
import BrandCertifications from "@/components/BrandCertifications";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/supabase/supabase";
import AnimatedSection from "@/components/AnimatedSection";
import { useSeo, pageSeo } from "@/lib/seo";

interface StockRow {
  id: string | number;
  title: string;
  year: string | number | null;
  price: number | string | null;
  description: string | null;
  image_url: string[] | string | null;
  miles_driven: string | number | null;
  attributes: string[] | null;
}

interface FeaturedTestimonial {
  id: string | number;
  image_url: string | null;
}

const toFeaturedCar = (item: StockRow): Car => ({
  id: item.id,
  title: item.title,
  make: "Mercedes-Benz",
  model: item.title.split(" ").slice(-1)[0] || "",
  year: Number(item.year),
  price: Number(item.price),
  description: item.description || "",
  imageUrl: Array.isArray(item.image_url)
    ? item.image_url
    : item.image_url
      ? [item.image_url]
      : [],
  mileage: Number(String(item.miles_driven ?? "").replace(/,/g, "")) || 0,
  features: Array.isArray(item.attributes) ? item.attributes : [],
  isSold: false,
});

const Index = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<
    FeaturedTestimonial[]
  >([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [carsError, setCarsError] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState(false);

  useEffect(() => {
    // Fetched independently so that a failure in one section (e.g. the customer
    // gallery) can never blank out the other section of the homepage.
    const fetchFeaturedCars = async () => {
      try {
        setCarsLoading(true);
        setCarsError(false);

        const { data: carsData, error: carsErr } = await supabase
          .from("stock_list")
          .select("*")
          .eq("is_available", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (carsErr) throw carsErr;

        setFeaturedCars(((carsData as StockRow[] | null) ?? []).map(toFeaturedCar));
      } catch (err) {
        console.error("Error loading featured cars:", err);
        setCarsError(true);
      } finally {
        setCarsLoading(false);
      }
    };

    const fetchFeaturedCustomers = async () => {
      try {
        setTestimonialsLoading(true);
        setTestimonialsError(false);

        const { data: testimonialsData, error: testimonialsErr } = await supabase
          .from("happy_customers")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (testimonialsErr) throw testimonialsErr;

        setFeaturedTestimonials(
          (testimonialsData as FeaturedTestimonial[] | null) ?? []
        );
      } catch (err) {
        console.error("Error loading happy customers:", err);
        setTestimonialsError(true);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchFeaturedCars();
    fetchFeaturedCustomers();
  }, []);

  useSeo(
    pageSeo("/", {
      cars: featuredCars.map((car) => ({ id: car.id, title: car.title })),
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <BrandCertifications />

        {/* Featured Cars Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-cardealer-dark mb-4">
                Featured Vehicles
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our selection of premium vehicles. Each car in our
                inventory has been carefully inspected to ensure quality and
                reliability.
              </p>
            </div>

            {carsLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-slow text-lg text-gray-600">
                  Loading featured cars...
                </div>
              </div>
            ) : carsError ? (
              <div className="text-center py-8 text-gray-600" role="status">
                We're having trouble loading our featured vehicles right now.
                Please call us on{" "}
                <a
                  href="tel:07877028198"
                  className="font-semibold hover:underline"
                >
                  07877 028198
                </a>{" "}
                or browse the{" "}
                <Link to="/stock" className="font-semibold hover:underline">
                  full inventory
                </Link>
                .
              </div>
            ) : featuredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {featuredCars.map((car, index) => (
                  <AnimatedSection key={car.id} delay={index * 120}>
                    <CarCard car={car} linkTo={`/car/${car.id}`} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Our featured vehicles are being updated. Please check back soon.
              </div>
            )}

            <div className="text-center">
              <Button
                asChild
                className="bg-cardealer-primary hover:bg-cardealer-secondary"
              >
                <Link to="/stock">View All Inventory</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        {/* ... no change here ... */}

        {/* Testimonials Section */}
        <section className="py-16 bg-cardealer-accent">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-cardealer-dark mb-4">
                Happy Customers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See our satisfied customers with their new vehicles from IQ
                MOTORS LIMITED.
              </p>
            </div>

            {testimonialsLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-slow text-lg text-gray-600">
                  Loading testimonials...
                </div>
              </div>
            ) : testimonialsError ? (
              <div className="text-center py-8 text-gray-600" role="status">
                We're having trouble loading our happy customers right now.
                Please check back shortly.
              </div>
            ) : featuredTestimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {featuredTestimonials.map((customer, index) => (
                  <AnimatedSection key={customer.id} delay={index * 120}>
                    <div className="bg-white p-4 rounded-lg shadow-sm hover-lift">
                      <div className="relative w-full h-80 overflow-hidden rounded-lg border-2 border-cardealer-primary group">
                        <img
                          src={customer.image_url || "/placeholder.svg"}
                          alt="Happy IQ Motors customer with their Mercedes-Benz"
                          className="w-full h-full object-cover img-zoom"
                        />
                      </div>
                      <p className="mt-3 text-center text-gray-600 italic">
                        "Another happy IQ Motors customer."
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Customer photos coming soon.
              </div>
            )}

            <div className="text-center">
              <Button
                asChild
                className="bg-cardealer-primary hover:bg-cardealer-secondary"
              >
                <Link to="/customers">View More Customers</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        {/* ... no change here ... */}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
