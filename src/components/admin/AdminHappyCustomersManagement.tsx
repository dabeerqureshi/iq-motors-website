import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHappyCustomers } from "@/hooks/useHappyCustomers";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminHappyCustomersManagement = () => {
  const { customers, loading, addCustomer, deleteCustomer } =
    useHappyCustomers();
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | number | null>(
    null
  );
  const { toast } = useToast();

  const handleAddCustomer = async () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await addCustomer(newImageUrl.trim());

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Happy customer added successfully",
      });
      setNewImageUrl("");
      setIsAddDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  const handleDeleteCustomer = async (id: string | number) => {
    setDeleteLoadingId(id);

    const { error } = await deleteCustomer(id);

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Happy customer deleted successfully",
      });
    }

    setDeleteLoadingId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading customers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Happy Customers Management</CardTitle>
              <CardDescription>
                Manage customer images displayed on the Happy Customers page
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Customer Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Happy Customer Image</DialogTitle>
                  <DialogDescription>
                    Enter the image URL for a new happy customer
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/customer-image.jpg"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCustomer} disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Customer"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <div key={customer.id} className="relative group">
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={customer.image_url}
                    alt="Happy customer"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="p-3">
                    <p className="text-sm text-gray-500 truncate">
                      {customer.image_url}
                    </p>
                    <p className="text-xs text-gray-400">
                      Added:{" "}
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(customer.image_url, "_blank")}
                    className="bg-white/90 hover:bg-white"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deleteLoadingId === customer.id}
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {customers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No customer images added yet. Click "Add Customer Image" to get
              started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHappyCustomersManagement;
