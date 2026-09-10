import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal starts (for stagger effects) */
  delay?: number;
  /** Animation variant */
  variant?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
}

const hiddenVariantClasses: Record<string, string> = {
  "fade-up": "opacity-0 translate-y-8",
  "fade-in": "opacity-0",
  "scale-in": "opacity-0 scale-95",
  "slide-left": "opacity-0 -translate-x-8",
  "slide-right": "opacity-0 translate-x-8",
};

/**
 * Scroll-triggered reveal wrapper using IntersectionObserver.
 * Animates its children in once when they enter the viewport.
 * Respects prefers-reduced-motion.
 */
const AnimatedSection = ({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none",
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : hiddenVariantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
