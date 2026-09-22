import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NOT_FOUND, useSeo } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  // Soft-404s must stay out of the search index: no <title> rewrite, but the
  // <meta name="robots" noindex,nofollow> is applied and no JSON-LD emitted.
  useSeo({
    title: NOT_FOUND.title,
    description: NOT_FOUND.description,
    path: location.pathname,
    noindex: NOT_FOUND.noindex,
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "New & Used Mercedes-Benz" },
    { href: "/servicing", label: "Servicing & MOT" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-6xl font-bold text-cardealer-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page at <span className="font-mono">{location.pathname}</span>{" "}
          does not exist.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="inline-flex items-center justify-center rounded-md border border-cardealer-primary px-5 py-2 text-sm font-semibold text-cardealer-primary transition-colors hover:bg-cardealer-primary hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;

