import { Card, CardContent } from "@/components/ui/card";

export interface Customer {
  id: string | number;
  name: string;
  testimonial: string;
  imageUrl: string;
  carPurchased: string;
}

interface CustomerCardProps {
  customer: Customer;
}

const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="relative w-full h-80 overflow-hidden rounded-lg border-2 border-cardealer-primary">
          <img
            src={customer.imageUrl}
            alt={`Happy customer with their car`}
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
