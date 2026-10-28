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
import {
  Award,
  ShieldCheck,
  Truck,
  Clock,
  Phone,
  MessageCircle,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
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
    // Fetched independently so that a failure in one section cannot blank out the other
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

        setFeaturedCars(
          ((carsData as StockRow[] | null) ?? []).map(toFeaturedCar)
        );
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
              <span className="text-sm font-semibold tracking-wider text-cardealer-primary uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Premium Selection
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-cardealer-dark mt-3 mb-4">
                Featured Mercedes-Benz
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our handpicked inventory of pristine Mercedes-Benz vehicles. Every car undergoes thorough multi-point mechanical inspections and history verification.
              </p>
            </div>

            {carsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border p-4 space-y-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-md" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : carsError ? (
              <div className="text-center py-12 text-gray-600 max-w-md mx-auto">
                <p className="text-lg font-medium text-gray-800 mb-2">Notice</p>
                <p className="text-sm mb-4">We are updating our live inventory. Please browse all cars or contact our showroom directly.</p>
                <Button asChild variant="outline">
                  <Link to="/stock">View Stock List</Link>
                </Button>
              </div>
            ) : featuredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {featuredCars.map((car, index) => (
                  <AnimatedSection key={car.id} delay={index * 100}>
                    <CarCard car={car} linkTo={`/car/${car.id}`} />
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Our featured vehicles are being updated.</p>
                <Button asChild className="mt-4 bg-cardealer-primary hover:bg-cardealer-secondary">
                  <Link to="/stock">Browse All Stock</Link>
                </Button>
              </div>
            )}

            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-cardealer-primary hover:bg-cardealer-secondary shadow-md hover-lift gap-2"
              >
                <Link to="/stock">
                  View All Available Stock
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-semibold tracking-wider text-cardealer-primary uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                The IQ Motors Standard
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-cardealer-dark mt-3 mb-4">
                Why Buy With Confidence From Us
              </h2>
              <p className="text-gray-600">
                Serving Ealing and London since 2011, we are dedicated Mercedes-Benz specialists committed to transparent pricing, exceptional customer service, and mechanical excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedSection delay={50}>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 text-cardealer-primary rounded-lg flex items-center justify-center mb-5">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-cardealer-dark mb-2">
                      Autotrader Award 2024
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Awarded for Highly Rated Customer Service 2024 with 5-star verified customer ratings across Autotrader and Google.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center gap-1 text-amber-500 text-sm font-semibold">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span className="text-gray-700 ml-1">5.0 Customer Rating</span>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={150}>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 text-cardealer-primary rounded-lg flex items-center justify-center mb-5">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-cardealer-dark mb-2">
                      Mercedes Specialists
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Specialized Mercedes-Benz diagnostic equipment, comprehensive history checks, and warranty-compliant maintenance schedules.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                    Full Pre-Delivery Inspection
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={250}>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 text-cardealer-primary rounded-lg flex items-center justify-center mb-5">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-cardealer-dark mb-2">
                      Free Local Delivery
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Complimentary vehicle delivery within a 10-mile radius of our Ealing showroom. Nationwide delivery available with competitive rates.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center text-sm font-medium text-blue-700">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-blue-600" />
                    Fast Nationwide Transport
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={350}>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 h-full flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 text-cardealer-primary rounded-lg flex items-center justify-center mb-5">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-cardealer-dark mb-2">
                      Open 7 Days a Week
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Operating on an appointment basis with same-day viewings and out-of-hours messaging so you can shop at your own convenience.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center text-sm font-medium text-purple-700">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-purple-600" />
                    Same-Day Viewings Available
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Testimonials / Happy Customers Section */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-wider text-cardealer-primary uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Customer Gallery
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-cardealer-dark mt-3 mb-4">
                Happy Customers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Real handover moments with our satisfied drivers collecting their new Mercedes-Benz from IQ MOTORS LIMITED.
              </p>
            </div>

            {testimonialsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : testimonialsError ? (
              <div className="text-center py-8 text-gray-600">
                Customer gallery is loading. Please check back shortly.
              </div>
            ) : featuredTestimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {featuredTestimonials.map((customer, index) => (
                  <AnimatedSection key={customer.id} delay={index * 120}>
                    <div className="bg-white p-4 rounded-xl shadow-sm hover-lift border">
                      <div className="relative w-full h-80 overflow-hidden rounded-lg border-2 border-cardealer-primary group">
                        <img
                          src={customer.image_url || "/placeholder.svg"}
                          alt="Happy IQ Motors customer with their Mercedes-Benz"
                          className="w-full h-full object-cover img-zoom"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-3 text-center text-gray-600 italic text-sm">
                        "Another happy driver taking delivery with IQ Motors."
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
                variant="outline"
                className="border-cardealer-primary text-cardealer-primary hover:bg-cardealer-primary hover:text-white"
              >
                <Link to="/customers">View Customer Gallery</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-stone-900/90 pointer-events-none" />
          <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
            <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase bg-blue-900/50 px-3 py-1 rounded-full border border-blue-700/50 inline-block mb-4">
              Get Behind The Wheel
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
              Find Your Ideal Mercedes-Benz Today
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you are looking to purchase, need flexible FCA-regulated finance, or want expert Mercedes-Benz servicing, our team in Ealing is ready to assist.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-cardealer-primary hover:bg-cardealer-secondary text-white hover-lift gap-2 font-semibold"
              >
                <Link to="/stock">
                  Browse Current Inventory
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-emerald-500 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover-lift gap-2 font-semibold"
              >
                <a
                  href="https://wa.me/447877028198?text=Hello%20IQ%20Motors%2C%20I%20would%20like%20to%20enquire%20about%20a%20vehicle"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-500 text-gray-200 bg-white/5 hover:bg-white/10 hover:text-white hover-lift gap-2"
              >
                <a href="tel:07877028198">
                  <Phone className="w-4 h-4" />
                  Call 07877 028198
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
