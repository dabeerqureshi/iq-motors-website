import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/stock", label: "Stock List" },
  { to: "/sold", label: "Sold Cars" },
  { to: "/customers", label: "Happy Customers" },
  { to: "/finance", label: "Finance" },
  { to: "/servicing", label: "Servicing" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bg-stone-800 text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/3c7bcaea-58c7-4726-9db6-0000eb740f42.png"
                alt="iQ Motors Logo"
                className="h-12 max-w-full"
              />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-1">
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
                  className={`px-3 py-2 rounded-md transition-all duration-300 text-sm md:text-base border-b-2 ${
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
