// components/CarDetailsModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import CarImageGallery from "./CarImageGallery";
import { Car } from "./CarCard";

interface CarDetailsModalProps {
  open: boolean;
  onClose: () => void;
  car: Car | null;
}

const CarDetailsModal = ({ open, onClose, car }: CarDetailsModalProps) => {
  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-cardealer-primary text-white rounded-md p-5">
          <DialogTitle className="text-wrap text-white text-xl">
            {car.title}
          </DialogTitle>
        </DialogHeader>

        <CarImageGallery
          images={car.galleryImages ?? car.imageUrl}
          carTitle={car.title}
        />

        <div className="mt-4 space-y-3">
          <p className="text-lg font-semibold">
            Price: {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(car.price)}
          </p>
          <p className="text-md">Year: {car.year}</p>
          <p className="text-md">
            Mileage: {new Intl.NumberFormat("en-GB").format(car.mileage)} miles
          </p>

          <div className="flex flex-wrap gap-2">
            {car.features.map((feature, i) => (
              <Badge key={i}>{feature}</Badge>
            ))}
          </div>

          <p className="text-gray-800">{car.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarDetailsModal;
