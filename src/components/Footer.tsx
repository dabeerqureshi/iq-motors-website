import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">IQ Motors Limited</h3>
            <p className="text-gray-300">
              Specialists in Mercedes-Benz, serving the community since 2011.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/stock"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Available Cars
                </Link>
              </li>
              <li>
                <Link
                  to="/finance"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Finance Options
                </Link>
              </li>
              <li>
                <Link
                  to="/servicing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Servicing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-gray-300 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                IQ MOTORS LIMITED
              </p>
              <p className="text-gray-300 pl-7">28 NORTHFIELD AVENUE</p>
              <p className="text-gray-300 pl-7">EALING</p>
              <p className="text-gray-300 pl-7 mb-2">W13 9RL</p>
              <a
                href="tel:07877028198"
                className="text-gray-300 flex items-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                07877 028198
              </a>
              <p className="text-gray-300 flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                iqmotors0@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} IQ MOTORS LIMITED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
