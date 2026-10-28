
import { Button } from "@/components/ui/button";
import { PhoneCall, RotateCcw, Search } from "lucide-react";

interface EmptyStockListProps {
  /** Only provided when filters are active; omitted when the inventory is genuinely empty. */
  resetFilters?: () => void;
  phoneDisplay?: string;
  phoneHref?: string;
}

const EmptyStockList = ({
  resetFilters,
  phoneDisplay = "07877 028198",
  phoneHref = "tel:07877028198",
}: EmptyStockListProps) => {
  return (
    <div className="text-center py-12" role="status" aria-live="polite">
      <Search className="h-10 w-10 text-gray-300 mx-auto mb-4" aria-hidden />
      <h3 className="text-2xl font-bold text-gray-500 mb-4">
        {resetFilters
          ? "No Vehicles Match Your Criteria"
          : "No Vehicles Available Right Now"}
      </h3>
      <p className="text-gray-600">
        {resetFilters
          ? "Try adjusting your filters or search terms."
          : "New stock arrives regularly — call us and we'll let you know what's coming in."}
      </p>

      {resetFilters ? (
        <Button
          className="mt-4 bg-cardealer-primary hover:bg-cardealer-secondary"
          onClick={resetFilters}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      ) : (
        <Button
          asChild
          className="mt-4 bg-cardealer-primary hover:bg-cardealer-secondary"
        >
          <a href={phoneHref}>
            <PhoneCall className="h-4 w-4 mr-2" />
            Call {phoneDisplay}
          </a>
        </Button>
      )}
    </div>
  );
};

export default EmptyStockList;
