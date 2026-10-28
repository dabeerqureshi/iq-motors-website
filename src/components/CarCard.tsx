import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CarImageGallery from "./CarImageGallery";
import CarDetailsModal from "./CarDetailsModal";

export interface Car {
  id: string | number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  imageUrl: string[];
  mileage: number;
  features: string[];
  isSold?: boolean;
  galleryImages?: string[];
}

interface CarCardProps {
  car: Car;
  /** Optional internal link (e.g. `/car/:id`). Sold cars without a link open the quick-look modal. */
  linkTo?: string;
}

/**
 * Rows created before `image_url` became an array (or edited by hand) can hold a
 * scalar string. Normalising here keeps `.length`/`[0]`/`.map` safe everywhere.
 */
const toImageArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }
  return [];
};

const CarCard = ({ car, linkTo }: CarCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Missing/invalid data must never render as "£NaN" or "NaN miles".
  const hasPrice =
    typeof car.price === "number" && Number.isFinite(car.price) && car.price > 0;
  const formattedPrice = hasPrice
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }).format(car.price)
    : "Price on request";

  const hasMileage =
    typeof car.mileage === "number" &&
    Number.isFinite(car.mileage) &&
    car.mileage > 0;
  const formattedMileage = hasMileage
    ? new Intl.NumberFormat("en-GB").format(car.mileage)
    : null;

  const hasYear = Number.isFinite(Number(car.year)) && Number(car.year) > 0;

  const galleryImages = toImageArray(car.galleryImages);
  const images = galleryImages.length > 0 ? galleryImages : toImageArray(car.imageUrl);

  const features = Array.isArray(car.features) ? car.features : [];

  const handleCardClick = () => {
    if (!linkTo) setModalOpen(true);
  };

  const cardClasses = "h-full cursor-pointer hover-lift group overflow-hidden";

  const cardInner = (
    <>
      <div className="relative overflow-hidden rounded-t-lg">
        {images.length > 0 ? (
          <CarImageGallery images={images} carTitle={car.title} />
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}

        {car.isSold && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 m-2 rounded-md font-bold z-20">
            SOLD
          </div>
        )}
      </div>

      <CardContent className="pt-4">
        <h3 className="text-xl font-bold mb-2 group-hover:text-cardealer-primary transition-colors duration-300">
          {car.title}
        </h3>
        <p className="text-lg font-semibold text-cardealer-primary mb-2">
          {formattedPrice}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {hasYear && (
            <Badge variant="outline" className="bg-gray-100">
              {car.year}
            </Badge>
          )}
          <Badge variant="outline" className="bg-gray-100">
            {formattedMileage ? `${formattedMileage} miles` : "Mileage on request"}
          </Badge>
        </div>
        <p className="text-gray-600 line-clamp-3">{car.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 flex-wrap">
            {features.slice(0, 3).map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-cardealer-accent"
              >
                {feature}
              </Badge>
            ))}
          </div>
          {!car.isSold && (
            <Badge className="bg-cardealer-primary hover:bg-cardealer-secondary">
              Available
            </Badge>
          )}
        </div>
      </CardFooter>
    </>
  );

  return (
    <>
      {linkTo ? (
        <Card className={`${cardClasses} relative`} data-testid="car-card">
          {cardInner}
          {/* Stretched link: the gallery controls stay outside the anchor so
              clicking an image arrow no longer navigates to the car page. */}
          <Link
            to={linkTo}
            aria-label={`View details of ${car.title}`}
            className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-cardealer-primary"
          />
        </Card>
      ) : (
        <Card
          onClick={handleCardClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View details of ${car.title}`}
          className={cardClasses}
          data-testid="car-card"
        >
          {cardInner}
        </Card>
      )}

      {/* Modal (only used for sold cars / cards without a link) */}
      <CarDetailsModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        car={car}
      />
    </>
  );
};

export default CarCard;
