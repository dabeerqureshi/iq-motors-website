import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/ea048769-bd2d-431c-b30b-d7aaea18d03d.png"
          alt="Mercedes-Benz vehicles at IQ Motors"
          className="w-full h-full object-cover animate-ken-burns motion-reduce:animate-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-36">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-up text-balance">
            Find Your Perfect Vehicle
          </h1>
          <p
            className="text-xl mb-8 animate-fade-up text-gray-200"
            style={{ animationDelay: "0.2s" }}
          >
            IQ Motors offers quality vehicles at competitive prices. Browse our
            extensive inventory and drive home your dream car today.
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-cardealer-primary hover:bg-cardealer-secondary text-white hover-lift"
            >
              <Link to="/stock">Browse Inventory</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 backdrop-blur-sm hover:bg-cardealer-primary hover:text-white hover:border-cardealer-primary"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
