import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Wrench,
  Clock,
  Truck,
  MapPin,
  Phone,
  Mail,
  PhoneCall,
  Check,
} from "lucide-react";

const Servicing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Mercedes Servicing</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Professional Mercedes maintenance and repairs by specialists who
              care about your vehicle
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <p className="mb-4 text-gray-700">
                  IQ Motors Limited Specialist in Mercedes Benz, Located in
                  Northfields West Ealing London, Stocking Over 30 Cars, Free
                  Delivery within 10 Miles, Charges Apply Thereafter, Open 7
                  Days A Week, Operating Appointments Only Basis - Available
                  Same Day, Fast Delivery Available, Buy With Confidence From An
                  Autotrader Award Winning Dealership For Highly Rated Customer
                  Service 2024, With 5 Star Autotrader & Google Customer Ratings
                  We Are Confident We Can Be The Next Dealership You Rely On.
                  Feel Free To Message Us Out Of Office Hours We Will Be Happy
                  To Help You.
                </p>

                <div className="bg-stone-300 p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-7 ">
                    Our Service Promise
                  </h2>
                  <p>
                    All Services are carried out in accordance with Manufacturer
                    Service Schedules, which means your new car warranty will be
                    unaffected.
                  </p>
                  <p>
                    Servicing at IQmotors really is a no compromise for
                    Mercedes-Benz owners
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  alt="Mercedes Service"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <Card className="p-6 border-md border-cardealer-primary">
                <div className="flex flex-col items-center text-center">
                  {/* <div className="w-16 h-16 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-2xl mb-4">
                    <Wrench size={28} />
                  </div> */}
                  <h3 className="text-xl font-bold mb-4">
                    Top Reasons to Choose IQmotors
                  </h3>

                  <ul className="text-left text-gray-700 space-y-2">
                    {[
                      "Save money over dealer prices",
                      "Fixed price service menu",
                      "Manufacturer supplied diagnostic equipment",
                      "Digital Service Book updated",
                      "Service Indicator reset",
                      "Manufacturer's warranty maintained when serviced by IQmotors",
                      "MOT, Service, Air Conditioning, Diagnostics",
                      "Approachable, helpful staff",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">
                          <Check
                            size={18}
                            className="text-green-500 mr-2 flex-shrink-0"
                          />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <Card className="p-6 border-md border-cardealer-primary">
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold mb-3">
                    Mercedes-Benz Price Guide
                  </h3>
                  <p className="text-gray-600">
                    Mercedes-Benz models can have a wide and varied range of
                    service schedules, ranging from Service A through B, B1 to
                    H, so we prefer to tailor each service to your individual
                    needs rather than show a general price that may not take
                    into account your mileage and personal needs. What you can
                    be sure of is that we guarantee to beat any local Mercedes
                    main dealer price for an identical service.
                  </p>

                  <p className="text-gray-600 mt-4">
                    Please complete the contact form below and we'll get back to
                    you as soon as we can. Alternatively;
                  </p>
                  <div className="flex flex-col items-center mt-4">
                    <p className="text-gray-600 font-bold">
                      <PhoneCall size={18} className="inline-block mr-2" />
                      <a href="tel:07877028198" className="hover:underline">
                        07877 028198
                      </a>{" "}
                      or
                    </p>

                    <p className="text-gray-600 font-bold">
                      <Mail size={18} className="inline-block mr-2" />{" "}
                      iqmotors0@gmail.com
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-md border-cardealer-primary">
                <div className="flex flex-col text-center">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Our Service Promise
                  </h3>
                  <ul className="text-left text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>Save money over dealer prices</span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>Fixed price service menu</span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>Service Indicator reset</span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>Manufacturer supplied diagnostic equipment</span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>Digital Service Book updated</span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>MOT, Service, Air Conditioning, Diagnostics</span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>
                        Manufacturers warranty maintained when serviced by
                        MercServices
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>Approachable, helpful staff</span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        size={18}
                        className="text-green-500 mr-2 flex-shrink-0"
                      />
                      <span>
                        We guarantee to beat any local Mercedes main dealer
                        price for an identical service
                      </span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="p-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h3 className="text-xl font-bold mb-4 text-cardealer-primary">
                    Visit Our Service Center
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-cardealer-primary" />{" "}
                      <span className="font-semibold">IQ MOTORS LIMITED</span>
                    </p>
                    <p className="pl-7">28 NORTHFIELD AVENUE</p>
                    <p className="pl-7">EALING</p>
                    <p className="pl-7 mb-2">W13 9RL</p>
                    <a
                      href="tel:07877028198"
                      className="flex items-center mb-2 hover:underline"
                    >
                      <Phone className="mr-2 h-5 w-5 text-cardealer-primary" />
                      <span className="font-semibold">07877 028198</span>
                    </a>

                    <p className="flex items-center mb-2">
                      <Mail className="mr-2 h-5 w-5 text-cardealer-primary" />
                      <span className="font-semibold">iqmotors0@gmail.com</span>
                    </p>
                  </div>
                  <p className="mt-4 mb-2">
                    <span className="font-semibold">Service Hours:</span>
                  </p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
                    <li>Saturday: 8:00 AM - 4:00 PM</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Servicing;
