import { useState, useCallback } from "react";
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

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1)),
    [allImages.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1)),
    [allImages.length]
  );

  // Keyboard navigation scoped to this gallery container when focused
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  // Single image: render directly
  if (allImages.length <= 1) {
    const img = allImages[0];
    return (
      <div className="relative w-full pt-[75%] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        <ImageWithFallback
          src={img ?? ""}
          alt={carTitle}
        />
      </div>
    );
  }

  // Multi-image gallery with navigation controls
  return (
    <div
      className="relative w-full group outline-none focus-visible:ring-2 focus-visible:ring-cardealer-primary rounded-lg"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${carTitle} photo gallery`}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full pt-[75%] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        <ImageWithFallback
          src={allImages[current]}
          alt={`${carTitle} - Photo ${current + 1} of ${allImages.length}`}
        />
      </div>

      {/* Slide counter pill */}
      <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
        {current + 1} / {allImages.length}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          prev();
        }}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white hover:scale-105 active:scale-95 transition-all"
        aria-label="Previous image"
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          next();
        }}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white hover:scale-105 active:scale-95 transition-all"
        aria-label="Next image"
        type="button"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 p-1 rounded-full bg-black/30 backdrop-blur-sm max-w-[85%] overflow-x-auto">
        {allImages.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrent(i);
            }}
            className={`h-2 transition-all rounded-full ${
              i === current
                ? "w-6 bg-white shadow-sm"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to photo ${i + 1}`}
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
}

const ImageWithFallback = ({ src, alt }: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
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
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      onError={() => setHasError(true)}
    />
  );
};

export default CarImageGallery;
