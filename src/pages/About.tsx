
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Learn more about IQ Motors Limited and our commitment to quality and customer satisfaction.
            </p>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-cardealer-dark">Our Story</h2>
                <p className="mb-4 text-gray-700">
                  IQ Motors Limited has been serving the Ealing community since 2011 with a simple mission: to provide high-quality Mercedes-Benz vehicles at fair prices, backed by exceptional customer service.
                </p>
                <p className="mb-4 text-gray-700">
                  We are an Autotrader Award Winning Dealership for Highly Rated Customer Service 2024, with 5-star Autotrader & Google customer ratings. Located in Northfields, West Ealing, we stock over 30 cars and are open 7 days a week on an appointment basis, available same day.
                </p>
                <p className="text-gray-700">
                  We've built our reputation on honesty, integrity, and a genuine commitment to customer satisfaction — we are confident we can be the next dealership you rely on.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1562520859-4b662cade141?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Dealership" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center text-cardealer-dark">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-16 h-16 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">Q</div>
                  <h3 className="text-xl font-bold mb-3">Quality</h3>
                  <p className="text-gray-600">
                    We carefully select and inspect every vehicle in our inventory to ensure it meets our high standards for quality and reliability.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-16 h-16 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">I</div>
                  <h3 className="text-xl font-bold mb-3">Integrity</h3>
                  <p className="text-gray-600">
                    We believe in transparency and honesty in every interaction. You'll always know exactly what you're getting, with no hidden surprises.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="w-16 h-16 bg-cardealer-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">S</div>
                  <h3 className="text-xl font-bold mb-3">Service</h3>
                  <p className="text-gray-600">
                    Our commitment to you doesn't end when you drive off the lot. We provide ongoing support and service to ensure your satisfaction.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1526996240281-c6f951e8be0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold mb-6 text-cardealer-dark">Our Team</h2>
                <p className="mb-4 text-gray-700">
                  IQ Motors is proud of our team of automotive professionals who bring decades of combined Mercedes-Benz experience to serving our customers. From our sales consultants to our service technicians, every member of our team is committed to providing knowledgeable guidance and exceptional service.
                </p>
                <p className="mb-4 text-gray-700">
                  We believe that car buying should be an enjoyable experience, not a stressful one. Feel free to message us out of office hours — we will be happy to help you.
                </p>
                <p className="text-gray-700">
                  All services are carried out in accordance with manufacturer service schedules, which means your new car warranty will be unaffected.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 bg-cardealer-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Visit our dealership today or browse our inventory online to find your perfect vehicle.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/stock">Browse Inventory</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cardealer-primary">
                <Link to="/contact">Contact Us</Link>
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
