
import { useState, useMemo, useEffect } from "react";
import { Car } from "@/components/CarCard";

interface StockFilteringResult {
  priceSort: string;
  setPriceSort: (value: string) => void;
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

export const useStockFiltering = (cars: Car[], itemsPerPage = 6): StockFilteringResult => {
  const [priceSort, setPriceSort] = useState<string>("none");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(car =>
        car.model.toLowerCase().includes(search) ||
        car.title.toLowerCase().includes(search) ||
        car.description.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    if (priceSort === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [cars, searchTerm, priceSort]);

  // Reset to page 1 whenever the filters change (keeps pagination valid)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceSort]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentItems = filteredCars.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Handle page navigation
  const goToPage = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceSort("none");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return {
    priceSort,
    setPriceSort,
    searchTerm,
    setSearchTerm,
    currentPage: safePage,
    setCurrentPage,
    filteredCars,
    currentItems,
    totalPages,
    resetFilters,
    goToPage
  };
};
