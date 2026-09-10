import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Finance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Financing Options</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We offer flexible financing solutions to help you drive home your
              dream car today, through brokers who are authorized and regulated
              by the financial conduct authority (FCA).
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-cardealer-dark">
                  Flexible Financing Solutions
                </h2>
                <p className="mb-4 text-gray-700">
                  At IQ Motors, we understand that purchasing a vehicle is a
                  significant investment. That's why we've partnered with
                  multiple financial institutions to offer competitive rates and
                  flexible terms tailored to your specific needs and budget.
                </p>
                <p className="mb-4 text-gray-700">
                  Whether you have excellent credit, are building your credit
                  history, or have had credit challenges in the past, our
                  finance experts will work diligently to find the right
                  financing solution for your situation.
                </p>
                <h3 className="text-xl font-bold mt-8 mb-4 text-cardealer-dark">
                  Benefits of Our Financing Program:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
                  <li>Competitive interest rates</li>
                  <li>Flexible loan terms (24-72 months)</li>
                  <li>Quick approval process</li>
                  <li>Options for all credit situations</li>
                  <li>No hidden fees or prepayment penalties</li>
                  <li>Trade-in value applied to down payment</li>
                </ul>
                {/* <Button asChild className="bg-cardealer-primary hover:bg-cardealer-secondary">
                  <Link to="/contact">Contact Our Finance Team</Link>
                </Button> */}
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  alt="Car financing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-20">
              <h2 className="text-3xl font-bold mb-8 text-center text-cardealer-dark">
                Financing Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    Choose Your Vehicle
                  </h3>
                  <p className="text-gray-600">
                    Browse our inventory and select the vehicle that meets your
                    needs and preferences.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    Apply for Financing
                  </h3>
                  <p className="text-gray-600">
                    Complete the finance application form online listed on our
                    Autotrader adverts or contact us for more info.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3">Review Options</h3>
                  <p className="text-gray-600">
                    The finance team will present you with financing options
                    tailored to your situation.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-12 h-12 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-3">Drive Home</h3>
                  <p className="text-gray-600">
                    Complete the paperwork and drive home in your new vehicle
                    the same day!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-cardealer-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Contact our finance team today to discuss your options or apply
              for pre-approval.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {/* <Button
                asChild
                className="bg-cardealer-primary hover:bg-cardealer-secondary"
              >
                <Link to="/contact">Contact Finance Team</Link>
              </Button> */}
              <Button
                asChild
                variant="outline"
                className="border-cardealer-primary text-cardealer-primary hover:bg-cardealer-primary hover:text-white"
              >
                <Link to="/stock">Browse Inventory</Link>
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
