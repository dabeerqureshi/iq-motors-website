import { useState, useMemo, useEffect } from "react";
import { Car } from "@/components/CarCard";

export type PriceRange = "all" | "under-10k" | "10k-20k" | "20k-30k" | "over-30k";
export type SortOption = "featured" | "price-asc" | "price-desc" | "year-desc" | "year-asc" | "mileage-asc";

interface StockFilteringResult {
  priceSort: string;
  setPriceSort: (value: string) => void;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  priceRange: PriceRange;
  setPriceRange: (value: PriceRange) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredCars: Car[];
  currentItems: Car[];
  totalPages: number;
  resetFilters: () => void;
  goToPage: (page: number) => void;
}

export const useStockFiltering = (
  cars: Car[],
  itemsPerPage = 6
): StockFilteringResult => {
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Backwards compatibility getter & setter for priceSort
  const priceSort =
    sortOption === "price-asc"
      ? "low-to-high"
      : sortOption === "price-desc"
      ? "high-to-low"
      : "none";

  const setPriceSort = (value: string) => {
    if (value === "low-to-high") {
      setSortOption("price-asc");
    } else if (value === "high-to-low") {
      setSortOption("price-desc");
    } else {
      setSortOption("featured");
    }
  };

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Apply search filter (title, model, description, features)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        (car) =>
          car.title.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search) ||
          car.description.toLowerCase().includes(search) ||
          car.features.some((f) => f.toLowerCase().includes(search))
      );
    }

    // Apply price range filter
    if (priceRange !== "all") {
      result = result.filter((car) => {
        const price = Number(car.price);
        if (priceRange === "under-10k") return price < 10000;
        if (priceRange === "10k-20k") return price >= 10000 && price <= 20000;
        if (priceRange === "20k-30k") return price > 20000 && price <= 30000;
        if (priceRange === "over-30k") return price > 30000;
        return true;
      });
    }

    // Apply sorting
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "year-desc") {
      result.sort((a, b) => b.year - a.year);
    } else if (sortOption === "year-asc") {
      result.sort((a, b) => a.year - b.year);
    } else if (sortOption === "mileage-asc") {
      result.sort((a, b) => a.mileage - b.mileage);
    }

    return result;
  }, [cars, searchTerm, sortOption, priceRange]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption, priceRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentItems = filteredCars.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Handle page navigation
  const goToPage = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };

  // Reset all filters
  const resetFilters = () => {
    setSortOption("featured");
    setPriceRange("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return {
    priceSort,
    setPriceSort,
    sortOption,
    setSortOption,
    priceRange,
    setPriceRange,
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    setCurrentPage,
    filteredCars,
    currentItems,
    totalPages,
    resetFilters,
    goToPage,
  };
};
