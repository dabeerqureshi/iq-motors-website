import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail, MessageCircle, Clock, CheckCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm font-semibold tracking-wider text-blue-200 uppercase bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30 inline-block mb-3">
              We're Here to Help
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact IQ Motors</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">
              Reach out to our Mercedes-Benz specialists in Ealing, London. We are available 7 days a week on an appointment basis with same-day viewings.
            </p>
          </div>
        </div>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-cardealer-dark mb-2">
                    Send Us an Enquiry
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Fill in the form below and one of our showroom advisors will respond shortly.
                  </p>
                </div>
                <ContactForm />
              </div>

              <div className="space-y-8">
                {/* Contact Information Card */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 text-cardealer-dark border-b pb-3">
                    Dealership & Showroom Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-cardealer-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gray-900">IQ MOTORS LIMITED</p>
                        <p className="text-gray-600 text-sm">28 Northfield Avenue, Ealing</p>
                        <p className="text-gray-600 text-sm">London, W13 9RL</p>
                        <p className="text-xs text-blue-600 mt-1 font-medium">Free delivery within 10 miles</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-cardealer-primary shrink-0" />
                      <div>
                        <a
                          href="tel:07877028198"
                          className="font-bold text-gray-900 hover:text-cardealer-primary transition-colors text-base"
                        >
                          07877 028198
                        </a>
                        <span className="text-xs text-gray-500 block">Calls, SMS & out of hours</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <a
                          href="https://wa.me/447877028198"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors text-base"
                        >
                          Chat on WhatsApp
                        </a>
                        <span className="text-xs text-gray-500 block">Instant chat & vehicle video walkarounds</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-cardealer-primary shrink-0" />
                      <div>
                        <a
                          href="mailto:iqmotors0@gmail.com"
                          className="font-medium text-gray-900 hover:text-cardealer-primary transition-colors text-sm"
                        >
                          iqmotors0@gmail.com
                        </a>
                        <span className="text-xs text-gray-500 block">General & sales enquiries</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-cardealer-primary" />
                      <h4 className="font-bold text-gray-900 text-sm">Opening & Viewing Hours</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <p className="font-semibold text-gray-800">Monday - Friday:</p>
                        <p>9:00 AM - 8:00 PM</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Saturday:</p>
                        <p>9:00 AM - 6:00 PM</p>
                      </div>
                      <div className="col-span-2 mt-1">
                        <p className="font-semibold text-gray-800">Sunday:</p>
                        <p>Appointments Only (Available Same Day)</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Appointments available same day — message us out of hours.
                    </p>
                  </div>
                </div>

                {/* Map card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 text-cardealer-dark">Showroom Location</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      title="IQ Motors Limited location map"
                      src="https://www.google.com/maps?q=IQ+Motors+Limited,+28+Northfield+Avenue,+Ealing,+W13+9RL&output=embed"
                      className="w-full h-72 border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=IQ+Motors+Limited+28+Northfield+Avenue+Ealing+W13+9RL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-cardealer-primary font-semibold text-sm hover:underline"
                  >
                    Open in Google Maps for Directions →
                  </a>
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

export default Contact;
