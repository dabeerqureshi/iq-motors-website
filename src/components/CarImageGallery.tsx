import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CarImageGalleryProps {
  images: string[];
  mainImage?: string;
  carTitle: string;
}

const CarImageGallery = ({
  images,
  mainImage,
  carTitle,
}: CarImageGalleryProps) => {
  const allImages = mainImage ? [mainImage, ...images] : images;

  return (
    <div className="relative">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {allImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <AspectRatio ratio={9 / 7}>
                  <img
                    src={image}
                    alt={`${carTitle} - Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default CarImageGallery;
