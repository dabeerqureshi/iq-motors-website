
import { Button } from "@/components/ui/button";

interface EmptyStockListProps {
  resetFilters: () => void;
}

const EmptyStockList = ({ resetFilters }: EmptyStockListProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-2xl font-bold text-gray-500 mb-4">No Vehicles Match Your Criteria</h3>
      <p className="text-gray-600">
        Try adjusting your filters or search terms.
      </p>
      <Button 
        className="mt-4 bg-cardealer-primary hover:bg-cardealer-secondary"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default EmptyStockList;
