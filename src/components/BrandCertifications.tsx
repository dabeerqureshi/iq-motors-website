import React from "react";

const BrandCertifications = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cardealer-dark mb-4">
            Our Brand Certifications
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're proud to be recognized for our commitment to quality and
            customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img
              src="/lovable-uploads/cebb6e9b-d79b-41cb-bdcb-9d74a5e4af03.png"
              alt="Autotrader Highly Rated 2024"
              className="max-h-48 mb-4"
            />
            <p className="text-cardealer-dark font-medium text-center">
              Highly Rated for Customer Service
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img
              src="/lovable-uploads/4b2fdb61-556e-48da-8f21-fc0997774503.png"
              alt="Zuto Car Finance"
              className="max-h-48 mb-4"
            />
            <p className="text-cardealer-dark font-medium text-center">
              Simplified Car Finance Options
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCertifications;
