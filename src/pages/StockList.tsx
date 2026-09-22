import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { useStockFiltering } from "@/hooks/useStockFiltering";
import StockListPagination from "@/components/stock/StockListPagination";
import EmptyStockList from "@/components/stock/EmptyStockList";
import { useStockList } from "@/hooks/useStockList";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Car as CarIcon } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useSeo, pageSeo } from "@/lib/seo";

const StockList = () => {
  const { stockItems, loading, error } = useStockList();

  const allCars = useMemo(() => {
    return [...stockItems];
  }, [stockItems]);

  const {
    priceSort,
    setPriceSort,
    searchTerm,
    setSearchTerm,
    currentPage,
    filteredCars,
    currentItems,
    totalPages,
    resetFilters,
    goToPage,
  } = useStockFiltering(allCars);

  const hasActiveFilters = searchTerm !== "" || priceSort !== "none";

  useSeo(
    pageSeo("/stock", {
      cars: stockItems.map((car) => ({ id: car.id, title: car.title })),
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-cardealer-primary text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Mercedes-Benz Inventory
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Browse our selection of quality Mercedes-Benz vehicles currently
              available for purchase.
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <AnimatedSection variant="fade-up" className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by model or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Search inventory"
                  />
                </div>

                <Select
                  value={priceSort}
                  onValueChange={(value) => setPriceSort(value)}
                >
                  <SelectTrigger className="w-full md:w-56">
                    <SelectValue placeholder="Sort by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sort: Newest first</SelectItem>
                    <SelectItem value="low-to-high">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="high-to-low">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex items-center gap-2 shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            </AnimatedSection>

            {/* Results summary */}
            {!loading && !error && (
              <p
                className="text-gray-600 mb-6 flex items-center gap-2"
                role="status"
                aria-live="polite"
              >
                <CarIcon className="h-4 w-4 text-cardealer-primary" />
                Showing{" "}
                <span className="font-semibold text-cardealer-dark">
                  {currentItems.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-cardealer-dark">
                  {filteredCars.length}
                </span>{" "}
                vehicles
                {totalPages > 1 && (
                  <span className="text-gray-400">
                    (page {currentPage} of {totalPages})
                  </span>
                )}
              </p>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-lg bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-gray-600 py-12">
                <h3 className="text-xl font-bold text-gray-500 mb-2">
                  We're having trouble loading our inventory
                </h3>
                <p>
                  Our vehicle database is temporarily unavailable. Please check
                  back shortly or call us on{" "}
                  <a href="tel:+447877028198" className="font-semibold hover:underline">
                    07877 028198
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((car, index) => (
                  <AnimatedSection key={car.id} delay={(index % 3) * 120}>
                    <CarCard car={car} linkTo={`/car/${car.id}`} />
                  </AnimatedSection>
                ))}
              </div>
            )}

            {!loading && !error && filteredCars.length === 0 && (
              <EmptyStockList
                resetFilters={hasActiveFilters ? resetFilters : undefined}
              />
            )}

            {/* Pagination */}
            {!loading && !error && filteredCars.length > 0 && (
              <StockListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StockList;
