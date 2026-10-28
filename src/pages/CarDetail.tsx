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
  MessageCircle,
  FileCheck2,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import CarImageGallery from "@/components/CarImageGallery";
import AnimatedSection from "@/components/AnimatedSection";
import FinanceCalculator from "@/components/FinanceCalculator";
import { supabase } from "@/supabase/supabase";

interface StockListItem {
  id: number;
  title: string;
  price: number;
  year: string | number;
  miles_driven: string | null;
  description: string | null;
  attributes: string[] | null;
  is_available: boolean;
  image_url: string[] | null;
}

const convertToCar = (item: StockListItem): Car => ({
  id: item.id,
  title: item.title,
  make: "Mercedes-Benz",
  model: item.title.split(" ").slice(-1)[0] || "Unknown",
  year: Number(item.year),
  price: Number(item.price),
  description: item.description || "",
  imageUrl: Array.isArray(item.image_url) ? item.image_url : [],
  mileage: parseInt((item.miles_driven || "0").replace(/,/g, "")) || 0,
  features: item.attributes || [],
  isSold: !item.is_available,
});

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
          const loadedCar = convertToCar(data as StockListItem);
          setCar(loadedCar);
          document.title = `${loadedCar.title} | IQ Motors Limited`;
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
      document.title = "IQ Motors Limited | Mercedes-Benz Specialists in Ealing, London";
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
    `Enquiry about ${car?.title ?? "a vehicle"} (Ref: #${car?.id})`
  );
  const enquiryBody = encodeURIComponent(
    `Hello IQ Motors,\n\nI would like to enquire about the ${
      car?.title ?? "vehicle"
    } listed on your website (Price: ${formattedPrice}).\n\nName:\nPhone:\nPreferred Viewing Time:`
  );

  const whatsappMessage = encodeURIComponent(
    `Hello IQ Motors, I am interested in the ${car?.title ?? "vehicle"} (Ref: #${car?.id}) listed for ${formattedPrice}. Is it still available for a viewing?`
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-cardealer-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 font-medium">Loading vehicle details...</p>
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
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center px-4 max-w-md">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-6 text-sm">
              We couldn't find the vehicle you're looking for. It may have been sold, removed, or our inventory is updating.
            </p>
            <Button asChild className="bg-cardealer-primary hover:bg-cardealer-secondary">
              <Link to="/stock">Browse Our Stock List</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = car.imageUrl;

  // Schema.org structured data for vehicle
  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Car",
    "name": car.title,
    "brand": {
      "@type": "Brand",
      "name": "Mercedes-Benz"
    },
    "model": car.model,
    "productionDate": String(car.year),
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": car.mileage,
      "unitCode": "SMI"
    },
    "offers": {
      "@type": "Offer",
      "price": car.price,
      "priceCurrency": "GBP",
      "availability": car.isSold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "seller": {
        "@type": "AutoDealer",
        "name": "IQ Motors Limited",
        "telephone": "+447877028198"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />

      <main className="flex-grow bg-gray-50/50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to="/stock" className="flex items-center gap-1.5 text-gray-700">
                <ArrowLeft className="h-4 w-4" />
                Back to Inventory
              </Link>
            </Button>
            <span className="text-xs text-gray-500 font-mono">Stock Ref: #{car.id}</span>
          </div>

          {/* Vehicle Title & Status */}
          <AnimatedSection variant="fade-up" className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-cardealer-dark">
                  {car.title}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Mercedes-Benz Specialist Stock • Northfields, Ealing
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={car.isSold ? "destructive" : "default"}
                  className={`text-sm px-3 py-1 font-bold ${
                    car.isSold ? "bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {car.isSold ? "SOLD" : "AVAILABLE FOR SALE"}
                </Badge>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Images, specs, description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car gallery */}
              {images.length > 0 ? (
                <CarImageGallery images={images} carTitle={car.title} />
              ) : (
                <div className="rounded-lg overflow-hidden border bg-gray-200 h-80 flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}

              {/* Key Specs Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 text-cardealer-dark">
                  Vehicle Highlights & Specifications
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-cardealer-primary mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs text-gray-500 font-medium">Year</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{car.year}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-cardealer-primary mb-1">
                      <Gauge className="h-4 w-4" />
                      <span className="text-xs text-gray-500 font-medium">Mileage</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {formattedMileage ? `${formattedMileage}` : "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-cardealer-primary mb-1">
                      <Settings className="h-4 w-4" />
                      <span className="text-xs text-gray-500 font-medium">Model</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 truncate">{car.model}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-xs text-gray-500 font-medium">Warranty</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">Available</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-3 text-cardealer-dark">
                  Vehicle Description
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {car.description || "Please contact our team for full vehicle history and specification."}
                </div>
              </div>

              {/* Features Badges */}
              {car.features.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold mb-3 text-cardealer-dark">
                    Key Features & Options
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-50 text-gray-800 text-xs py-1 px-2.5 font-medium border-gray-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Embedded Finance Calculator */}
              {!car.isSold && (
                <div>
                  <FinanceCalculator
                    initialPrice={car.price}
                    vehicleTitle={car.title}
                    vehicleId={car.id}
                  />
                </div>
              )}
            </div>

            {/* Right column - Price, CTA and Dealership assurances */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:sticky lg:top-24 space-y-6">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                    Showroom Price
                  </span>
                  <p className="text-3xl md:text-4xl font-extrabold text-cardealer-primary mt-1">
                    {formattedPrice}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Competitive finance available from £{Math.round(car.price * 0.023)}/mo
                  </p>
                </div>

                {!car.isSold ? (
                  <div className="space-y-3 pt-2">
                    {/* Primary WhatsApp CTA */}
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm gap-2"
                    >
                      <a
                        href={`https://wa.me/447877028198?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat on WhatsApp
                      </a>
                    </Button>

                    {/* Call CTA */}
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full border-cardealer-primary text-cardealer-primary hover:bg-cardealer-primary hover:text-white font-semibold gap-2"
                    >
                      <a href="tel:07877028198">
                        <Phone className="w-4 h-4" />
                        Call 07877 028198
                      </a>
                    </Button>

                    {/* Book Viewing CTA */}
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full bg-blue-50 text-cardealer-primary hover:bg-blue-100 font-semibold gap-2"
                    >
                      <Link
                        to={`/contact?enquiry=viewing&car=${encodeURIComponent(
                          car.title
                        )}&id=${car.id}`}
                      >
                        <CalendarCheck className="w-4 h-4" />
                        Book Viewing / Test Drive
                      </Link>
                    </Button>

                    {/* Email CTA */}
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full text-gray-600 hover:text-gray-900 gap-1.5"
                    >
                      <a
                        href={`mailto:iqmotors0@gmail.com?subject=${enquirySubject}&body=${enquiryBody}`}
                      >
                        <Mail className="w-4 h-4" />
                        Email About This Car
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="font-bold text-red-700">This vehicle has been sold</p>
                    <p className="text-xs text-red-600 mt-1 mb-3">
                      We source premium Mercedes-Benz regularly. Let us find your ideal specification.
                    </p>
                    <Button asChild size="sm" className="bg-cardealer-primary hover:bg-cardealer-secondary">
                      <Link to="/contact?enquiry=sourcing">Request Similar Vehicle</Link>
                    </Button>
                  </div>
                )}

                {/* Dealer Guarantees */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Autotrader Award Winning Dealership 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free Delivery within 10 Miles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Open 7 Days — Appointments Available Same Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>FCA Regulated Finance Broker Partners</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-cardealer-primary" />
                    Northfield Avenue, Ealing, London W13 9RL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetail;
