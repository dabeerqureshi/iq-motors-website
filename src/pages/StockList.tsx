import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { useStockFiltering, SortOption, PriceRange } from "@/hooks/useStockFiltering";
import StockListPagination from "@/components/stock/StockListPagination";
import EmptyStockList from "@/components/stock/EmptyStockList";
import { useStockList } from "@/hooks/useStockList";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Car as CarIcon, Phone, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useSeo, pageSeo } from "@/lib/seo";

const StockList = () => {
  const { stockItems, loading, error } = useStockList();

  const allCars = useMemo(() => {
    return [...stockItems];
  }, [stockItems]);

  const {
    sortOption,
    setSortOption,
    priceRange,
    setPriceRange,
    searchTerm,
    setSearchTerm,
    currentPage,
    filteredCars,
    currentItems,
    totalPages,
    resetFilters,
    goToPage,
  } = useStockFiltering(allCars);

  const hasActiveFilters =
    searchTerm !== "" || sortOption !== "featured" || priceRange !== "all";

  useSeo(
    pageSeo("/stock", {
      cars: stockItems.map((car) => ({ id: car.id, title: car.title })),
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Banner */}
        <div className="bg-cardealer-primary text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm font-semibold tracking-wider text-blue-200 uppercase bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30 inline-block mb-3">
              Inspected & Prepared Stock
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mercedes-Benz Inventory
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">
              Browse our curated selection of quality Mercedes-Benz vehicles currently available at our Ealing showroom.
            </p>
          </div>
        </div>

        <section className="py-12 bg-gray-50/50">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <AnimatedSection variant="fade-up" className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-4 md:p-5 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by model, C-Class, AMG, estate, diesel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                    aria-label="Search inventory"
                  />
                </div>

                {/* Price Range Filter */}
                <div className="w-full sm:w-auto">
                  <Select
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(val as PriceRange)}
                  >
                    <SelectTrigger className="w-full sm:w-48 h-10">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-10k">Under £10,000</SelectItem>
                      <SelectItem value="10k-20k">£10,000 - £20,000</SelectItem>
                      <SelectItem value="20k-30k">£20,000 - £30,000</SelectItem>
                      <SelectItem value="over-30k">Over £30,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Option */}
                <div className="w-full sm:w-auto">
                  <Select
                    value={sortOption}
                    onValueChange={(val) => setSortOption(val as SortOption)}
                  >
                    <SelectTrigger className="w-full sm:w-56 h-10">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Sort: Newest Listed</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="year-desc">Year: Newest</SelectItem>
                      <SelectItem value="year-asc">Year: Oldest</SelectItem>
                      <SelectItem value="mileage-asc">Mileage: Lowest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset button */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 shrink-0 h-10 text-gray-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Filters
                  </Button>
                )}
              </div>
            </AnimatedSection>

            {/* Results summary bar */}
            {!loading && !error && (
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-sm text-gray-600">
                <p
                  className="flex items-center gap-2 font-medium"
                  role="status"
                  aria-live="polite"
                >
                  <CarIcon className="h-4 w-4 text-cardealer-primary" />
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {currentItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">
                    {filteredCars.length}
                  </span>{" "}
                  vehicles available
                  {totalPages > 1 && (
                    <span className="text-gray-400 font-normal">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Need immediate help?</span>
                  <a
                    href="https://wa.me/447877028198"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Stock Enquiry
                  </a>
                </div>
              </div>
            )}

            {/* Content states */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-xl bg-white border p-4 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="h-48 bg-gray-200 rounded-lg" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-gray-600 py-16 bg-white rounded-xl border p-8 max-w-lg mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Inventory Updating
                </h3>
                <p className="text-sm mb-6">
                  Our live stock is momentarily syncing. Please call our showroom directly on{" "}
                  <a href="tel:+447877028198" className="font-semibold text-cardealer-primary hover:underline">
                    07877 028198
                  </a>{" "}
                  for immediate vehicle availability.
                </p>
                <div className="flex justify-center gap-3">
                  <Button asChild className="bg-cardealer-primary hover:bg-cardealer-secondary">
                    <a href="tel:+447877028198">
                      <Phone className="w-4 h-4 mr-2" />
                      Call 07877 028198
                    </a>
                  </Button>
                </div>
              </div>
            ) : filteredCars.length === 0 ? (
              <EmptyStockList resetFilters={hasActiveFilters ? resetFilters : undefined} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.map((car, index) => (
                  <AnimatedSection key={car.id} delay={(index % 3) * 100}>
                    <CarCard car={car} linkTo={`/car/${car.id}`} />
                  </AnimatedSection>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-12">
                <StockListPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StockList;
