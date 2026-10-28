import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Award, HeartHandshake, Phone } from "lucide-react";

const About = () => {
  useEffect(() => {
    document.title = "About Us | IQ Motors Limited Mercedes-Benz Specialists";
    return () => {
      document.title = "IQ Motors Limited | Mercedes-Benz Specialists in Ealing, London";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm font-semibold tracking-wider text-blue-200 uppercase bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30 inline-block mb-3">
              Established 2011 • Ealing, London
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About IQ Motors</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">
              Mercedes-Benz specialists serving West London with integrity, transparent pricing, and award-winning customer service.
            </p>
          </div>
        </div>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-cardealer-dark">Our Story</h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  IQ Motors Limited has been serving the Ealing community since 2011 with a simple mission: to provide high-quality Mercedes-Benz vehicles at fair prices, backed by exceptional customer care.
                </p>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We are an Autotrader Award Winning Dealership for Highly Rated Customer Service 2024, maintaining 5-star Autotrader & Google customer ratings. Located in Northfields, West Ealing, we stock over 30 inspected cars and operate 7 days a week on an appointment basis with same-day viewings available.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We have built our reputation on honesty, transparency, and a genuine commitment to customer satisfaction. We are confident we can be the next dealership you rely on.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1562520859-4b662cade141?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="IQ Motors Dealership"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-cardealer-dark">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 border border-gray-100 p-8 rounded-xl shadow-sm text-center">
                  <div className="w-14 h-14 bg-cardealer-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-cardealer-dark">Quality Assured</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We carefully select and inspect every Mercedes-Benz in our inventory to ensure it meets strict mechanical standards and warranty criteria.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-8 rounded-xl shadow-sm text-center">
                  <div className="w-14 h-14 bg-cardealer-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-cardealer-dark">Integrity & Transparency</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We believe in full transparency in every interaction. Clear pricing, documented mileage, and complete history with no hidden surprises.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-8 rounded-xl shadow-sm text-center">
                  <div className="w-14 h-14 bg-cardealer-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartHandshake className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-cardealer-dark">Dedicated Service</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our relationship does not end when you drive away. We provide ongoing servicing, MOT support, and warranty backing for complete peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-stone-900 text-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Visit our Ealing showroom today or browse our online stock to find your perfect Mercedes-Benz.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-cardealer-primary hover:bg-cardealer-secondary font-semibold">
                <Link to="/stock">Browse Inventory</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-500 text-white hover:bg-white/10">
                <Link to="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
