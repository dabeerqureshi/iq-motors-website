import { useState, useEffect, useCallback } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
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
  // Defensive: a legacy row could hold a scalar string instead of an array.
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const allImages = mainImage ? [mainImage, ...safeImages] : safeImages;
  const [current, setCurrent] = useState(0);

  // Keep the active index in range when the image list changes (e.g. car swap).
  useEffect(() => {
    setCurrent((c) => (c >= allImages.length ? 0 : c));
  }, [allImages.length]);

  // Multi-image navigation handlers (must be declared before early return to respect rules of hooks)
  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? allImages.length - 1 : c - 1)),
    [allImages.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c === allImages.length - 1 ? 0 : c + 1)),
    [allImages.length]
  );

  // Keyboard navigation for accessibility, scoped to the gallery itself so that
  // arrow keys don't hijack page scrolling and several galleries on one page
  // (e.g. the stock grid) don't all advance at once.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      next();
    }
  };

  // Controls live inside a card that may itself link elsewhere: keep clicks on
  // the gallery controls from navigating away.
  const handleControl = (e: MouseEvent<HTMLButtonElement>, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

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
  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={`${carTitle} images`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cardealer-primary"
    >
      <div className="relative w-full pt-[75%] overflow-hidden rounded-lg border border-gray-200">
        <ImageWithFallback
          src={allImages[current]}
          alt={`${carTitle} - image ${current + 1} of ${allImages.length}`}
          hasImage={Boolean(allImages[current])}
        />
      </div>

      <span className="sr-only" aria-live="polite">
        Image {current + 1} of {allImages.length}
      </span>

      <button
        onClick={(e) => handleControl(e, prev)}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cardealer-primary"
        aria-label="Previous image"
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        onClick={(e) => handleControl(e, next)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cardealer-primary"
        aria-label="Next image"
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
        {allImages.map((_, i) => (
          <button
            key={i}
            onClick={(e) => handleControl(e, () => setCurrent(i))}
            className={`h-2 transition-all rounded-full ${
              i === current
                ? "w-6 bg-cardealer-primary"
                : "w-2 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
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
