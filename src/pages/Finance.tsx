import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FinanceCalculator from "@/components/FinanceCalculator";
import { CheckCircle2, Phone, MessageSquare, ArrowRight } from "lucide-react";

const Finance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm font-semibold tracking-wider text-blue-200 uppercase bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30 inline-block mb-3">
              FCA Regulated Brokers
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mercedes-Benz Financing Options
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">
              We offer flexible financing solutions through reputable brokers authorized and regulated by the Financial Conduct Authority (FCA).
            </p>
          </div>
        </div>

        {/* Interactive Calculator Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-cardealer-dark mb-3">
                Calculate Your Monthly Budget
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Use our interactive finance calculator to estimate monthly repayments based on your chosen vehicle price, deposit, and repayment term.
              </p>
            </div>
            <FinanceCalculator initialPrice={16500} />
          </div>
        </section>

        {/* Benefits & Info Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-cardealer-dark">
                  Tailored Financing Solutions
                </h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  At IQ Motors, we understand that purchasing a prestige vehicle is a significant investment. That is why we partner with FCA-regulated brokerages to offer competitive rates and flexible terms tailored to your circumstances.
                </p>
                <p className="mb-6 text-gray-700 leading-relaxed">
                  Whether you have excellent credit, are building your credit history, or want to explore Hire Purchase (HP) or Personal Contract Purchase (PCP), our partners work diligently to secure the right option for you.
                </p>
                <h3 className="text-xl font-bold mb-4 text-cardealer-dark">
                  Key Benefits of Our Financing Partners:
                </h3>
                <ul className="space-y-3 text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Competitive representative APR rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Flexible loan terms from 24 to 60 months</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Fast online approvals with minimal paperwork</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Options for all credit profiles and backgrounds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Transparent terms with zero hidden fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Part exchange value applied directly toward your deposit</span>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Button asChild className="bg-cardealer-primary hover:bg-cardealer-secondary shadow-sm">
                    <Link to="/contact?enquiry=finance">Speak to Our Finance Team</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/stock">Browse Available Cars</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Car finance consultation at IQ Motors"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 4-Step Process */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold mb-10 text-center text-cardealer-dark">
                Simple 4-Step Finance Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl text-center shadow-sm">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-cardealer-dark">
                    Select Your Vehicle
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Browse our stock list of quality Mercedes-Benz cars and pick the model that fits your lifestyle.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl text-center shadow-sm">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-cardealer-dark">
                    Apply Online
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Complete a quick finance enquiry through our website or directly on our Autotrader advert.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl text-center shadow-sm">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-cardealer-dark">
                    Review Your Options
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our broker partners present transparent finance proposals tailored to your budget with no obligation.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl text-center shadow-sm">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-cardealer-dark">
                    Drive Home
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sign your paperwork securely and collect your inspected, valeted Mercedes-Benz from our Ealing showroom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-14 bg-stone-900 text-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Discuss Your Financing?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Speak directly with our team for advice on finance applications, part exchanges, and same-day collection.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-cardealer-primary hover:bg-cardealer-secondary text-white font-semibold shadow-md gap-2"
              >
                <Link to="/contact?enquiry=finance">
                  Contact Our Finance Team
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gray-500 text-white bg-white/5 hover:bg-white/10 gap-2"
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

export default Finance;
