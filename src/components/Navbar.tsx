import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/stock", label: "Stock List" },
  { to: "/sold", label: "Sold Cars" },
  { to: "/customers", label: "Happy Customers" },
  { to: "/finance", label: "Finance" },
  { to: "/servicing", label: "Servicing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-stone-800 text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
            <img
              src="/lovable-uploads/3c7bcaea-58c7-4726-9db6-0000eb740f42.png"
              alt="iQ Motors Logo"
              className="h-12 max-w-full"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-2 rounded-md transition-all duration-300 text-sm border-b-2 ${
                    isActive
                      ? "bg-cardealer-secondary text-white border-cardealer-secondary font-semibold"
                      : "border-transparent text-gray-200 hover:bg-cardealer-secondary hover:text-white hover:border-cardealer-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-200 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-stone-700 pt-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.to === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-4 py-3 rounded-md transition-all duration-300 ${
                      isActive
                        ? "bg-cardealer-secondary text-white font-semibold"
                        : "text-gray-200 hover:bg-cardealer-secondary hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
