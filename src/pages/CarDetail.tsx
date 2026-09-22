import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Car } from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Gauge,
  Settings,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import CarImageGallery from "@/components/CarImageGallery";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/supabase/supabase";
import { useSeo, vehicleSeo, vehicleSchema } from "@/lib/seo";
import { toCar, StockRow } from "@/lib/stock";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCar = async () => {
      setLoading(true);
      setCar(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("stock_list")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          setCar(toCar(data as StockRow));
        }
      } catch (err) {
        console.error("Error fetching car:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCar();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const formattedPrice = car?.price
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }).format(car.price)
    : "Contact us for pricing";

  const formattedMileage = car?.mileage
    ? new Intl.NumberFormat("en-GB").format(car.mileage)
    : "";

  const enquirySubject = encodeURIComponent(
    `Enquiry about ${car?.title ?? "a vehicle"}`
  );
  const enquiryBody = encodeURIComponent(
    `Hello IQ Motors,\n\nI would like to know more about the ${
      car?.title ?? "vehicle"
    } listed on your website.\n\nName:\nPhone:\nMessage:`
  );

  // SEO: set per-vehicle title/description/schema when we have the car data
  useSeo(
    car
      ? {
          ...vehicleSeo({
            id: car.id,
            title: car.title,
            year: car.year,
            price: car.price,
            mileage: car.mileage,
          }),
          image: car.imageUrl[0] ?? undefined,
          schema: [
            vehicleSchema({
              id: car.id,
              title: car.title,
              year: car.year,
              price: car.price,
              mileage: car.mileage,
              description: car.description || undefined,
              images: car.imageUrl,
              isSold: car.isSold ?? false,
            }),
          ],
        }
      : {
          title: "Vehicle Not Found | IQ Motors",
          description:
            "The vehicle page you were looking for does not exist. Browse our used Mercedes-Benz stock at IQ Motors in Ealing.",
          path: `/car/${id ?? ""}`,
          noindex: true,
          schema: [],
        }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse-slow text-lg text-gray-600">
            Loading vehicle...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold mb-4">Vehicle Not Found</h1>
            <p className="text-xl text-gray-600 mb-6">
              We couldn't find the vehicle you're looking for. It may have been
              sold, removed, or our inventory is temporarily unavailable.
            </p>
            <Button asChild>
              <Link to="/stock">Browse Our Inventory</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = car.imageUrl;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Button variant="outline" asChild className="mb-6">
            <Link to="/stock" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Link>
          </Button>

          {/* Vehicle Title */}
          <AnimatedSection variant="fade-up" className="mb-6">
            <h1 className="text-3xl font-bold">{car.title}</h1>
            <div className="flex items-center mt-2">
              <Badge
                variant={car.isSold ? "destructive" : "default"}
                className="mr-2"
              >
                {car.isSold ? "SOLD" : "Available"}
              </Badge>
              <p className="text-gray-600">ID: {car.id}</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Image and specs */}
            <div className="lg:col-span-2">
              {/* Car gallery - carousel from the vehicle's Supabase images */}
              {images.length > 0 ? (
                <div className="mb-6">
                  <CarImageGallery images={images} carTitle={car.title} />
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden mb-6">
                  <div className="h-80 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                </div>
              )}

              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">
                  Vehicle Specifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-cardealer-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-cardealer-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Make</p>
                      <p className="font-semibold">{car.make}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-cardealer-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Model</p>
                      <p className="font-semibold">{car.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-cardealer-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Mileage</p>
                      <p className="font-semibold">{formattedMileage} miles</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {car.description}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-100"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Price and contact */}
            <div className="lg:col-span-1">
              <AnimatedSection variant="slide-right" delay={150}>
                <div className="bg-white rounded-lg p-6 shadow-sm mb-6 lg:sticky lg:top-24">
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-3xl font-bold text-cardealer-primary">
                      {formattedPrice}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Quick Details</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={
                            car.isSold
                              ? "text-red-600 font-bold flex items-center"
                              : "text-green-600 font-bold flex items-center"
                          }
                        >
                          {car.isSold ? (
                            <XCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          {car.isSold ? "SOLD" : "Available"}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Make:</span>
                        <span>{car.make}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span>{car.model}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span>{car.year}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Mileage:</span>
                        <span>
                          {formattedMileage
                            ? `${formattedMileage} miles`
                            : "—"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {!car.isSold && (
                    <div>
                      <Button
                        asChild
                        className="w-full mb-3 bg-cardealer-primary hover:bg-cardealer-secondary hover-lift"
                      >
                        <a
                          href={`mailto:info@iqmotorslimited.com?subject=${enquirySubject}&body=${enquiryBody}`}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Contact About This Car
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full mb-3 border-cardealer-primary text-cardealer-primary hover:bg-cardealer-primary hover:text-white"
                      >
                        <a href="tel:+447877028198">
                          <Phone className="mr-2 h-4 w-4" />
                          Call 07877 028198
                        </a>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/finance" className="w-full">
                          Finance Options
                        </Link>
                      </Button>
                    </div>
                  )}

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      IQ Motors Limited - Ealing, London
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetail;
