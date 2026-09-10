import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [current, setCurrent] = useState(0);

  // Single image: render directly, no carousel overhead.
  if (allImages.length <= 1) {
    const img = allImages[0];
    return (
      <div className="relative w-full pt-[75%] overflow-hidden rounded-lg border border-gray-200">
        <ImageWithFallback
          src={img ?? ""}
          alt={carTitle}
          hasImage={Boolean(img)}
        />
      </div>
    );
  }

  // Multi-image: custom gallery with navigation (replaces shadcn Carousel,
  // which has ref-callback issues with embla v8 causing blank frames).
  const prev = () =>
    setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full">
      <div className="relative w-full pt-[75%] overflow-hidden rounded-lg border border-gray-200">
        <ImageWithFallback
          src={allImages[current]}
          alt={`${carTitle} - Slide ${current + 1}`}
          hasImage={Boolean(allImages[current])}
        />
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Previous image"
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Next image"
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
        {allImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 transition-all rounded-full ${
              i === current
                ? "w-6 bg-cardealer-primary"
                : "w-2 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  hasImage?: boolean;
}

// Image wrapper with error fallback so a broken URL never renders blank.
const ImageWithFallback = ({
  src,
  alt,
  hasImage = true,
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        Image Unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

export default CarImageGallery;
