import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CarCard from "@/components/CarCard";
import BrandCertifications from "@/components/BrandCertifications";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/supabase/supabase";
import AnimatedSection from "@/components/AnimatedSection";

const Index = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Fetch featured cars from stock_list where is_available = true
        const { data: carsData, error: carsError } = await supabase
          .from("stock_list")
          .select("*")
          .eq("is_available", true)
          .limit(6);

        if (carsError) throw carsError;

        const formattedCars = carsData.map((item) => ({
          id: item.id,
          title: item.title,

          year: Number(item.year),
          price: Number(item.price),
          description: item.description || "",
          imageUrl: Array.isArray(item.image_url)
            ? item.image_url
            : item.image_url
              ? [item.image_url]
              : [],
          mileage: parseInt(item.miles_driven?.replace(/,/g, "") || "0"),
          features: item.attributes || [],
        }));

        setFeaturedCars(formattedCars);

        // Fetch featured testimonials from testimonials table
        const { data: testimonialsData, error: testimonialsError } =
          await supabase.from("happy_customers").select("*").limit(3);

        if (testimonialsError) throw testimonialsError;

        setFeaturedTestimonials(testimonialsData);
      } catch (err) {
        console.error("Error loading homepage data:", err);
        setError("Failed to load homepage content.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-slow text-lg text-gray-600">
                  Loading featured cars...
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-gray-600">
                We're having trouble loading our featured vehicles right now.
                Please check back shortly.
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

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-slow text-lg text-gray-600">
                  Loading testimonials...
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-gray-600">
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
