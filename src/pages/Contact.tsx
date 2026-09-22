
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, Mail } from "lucide-react";
import { useSeo, pageSeo } from "@/lib/seo";

const Contact = () => {
  useSeo(pageSeo("/contact"));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Have questions or want to schedule a test drive? Reach out to our team today.
            </p>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h3 className="text-xl font-bold mb-4 text-cardealer-primary">Visit Our Dealership</h3>
                  <div className="space-y-2">
                    <p className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-cardealer-primary" /> <span className="font-semibold">IQ MOTORS LIMITED</span></p>
                    <p className="pl-7">28 NORTHFIELD AVENUE</p>
                    <p className="pl-7">EALING</p>
                    <p className="pl-7 mb-2">W13 9RL</p>
                    <p className="flex items-center mb-2">
                      <Phone className="mr-2 h-5 w-5 text-cardealer-primary" /> 
                      <span className="font-semibold">07877 028198</span>
                    </p>
                    <p className="flex items-center mb-2">
                      <Mail className="mr-2 h-5 w-5 text-cardealer-primary" />
                      <span className="font-semibold">info@iqmotorslimited.com</span>
                    </p>
                  </div>
                  <p className="mt-4 mb-2"><span className="font-semibold">Sales Hours:</span></p>
                  <ul className="list-disc list-inside ml-4 mb-2">
                    <li>Monday - Friday: 9:00 AM - 8:00 PM</li>
                    <li>Saturday: 9:00 AM - 6:00 PM</li>
                    <li>Sunday: Closed</li>
                  </ul>
                  <p className="mb-2"><span className="font-semibold">Service Hours:</span></p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
                    <li>Saturday: 8:00 AM - 4:00 PM</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-cardealer-primary">Map & Directions</h3>
                  <div className="rounded-lg overflow-hidden">
                    <iframe
                      title="IQ Motors Limited location map"
                      src="https://www.google.com/maps?q=IQ+Motors+Limited,+28+Northfield+Avenue,+Ealing,+W13+9RL&output=embed"
                      className="w-full h-80 border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=IQ+Motors+Limited+28+Northfield+Avenue+Ealing+W13+9RL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-cardealer-primary font-semibold hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-cardealer-accent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">We're Here to Help</h2>
            <p className="text-xl mb-4 max-w-2xl mx-auto">
              Whether you're looking to purchase a vehicle, need service on your current car, or have questions about financing, our team is ready to assist you.
            </p>
            <p className="text-lg max-w-2xl mx-auto">
              Call us at <span className="font-bold">07877 028198</span> for immediate assistance.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
