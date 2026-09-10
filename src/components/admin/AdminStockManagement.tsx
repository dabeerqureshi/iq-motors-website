import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/supabase/supabase";
import { useToast } from "@/hooks/use-toast";

interface stock_list {
  id: string;
  title: string;
  price: number;
  year: number;
  miles_driven: string;
  description: string | null;
  attributes: string[] | null;
  is_available: boolean;
  image_url: string[] | null;
  created_at: string;
}

const AdminStockManagement = () => {
  const [stockItems, setStockItems] = useState<stock_list[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    year: "",
    miles_driven: "",
    description: "",
    attributes: "",
    is_available: true,
    image_url: "",
  });

  const fetchStockItems = async () => {
    try {
      setLoading(true);

      const { data: stock_list, error } = await supabase
        .from("stock_list")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStockItems(stock_list || []);
    } catch (error) {
      console.error("Error fetching stock items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch stock items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockItems();
  }, []);

  const handleAddCar = async () => {
    try {
      const attributes = formData.attributes
        ? formData.attributes
            .split(",")
            .map((attr) => attr.trim())
            .filter((attr) => attr)
        : [];
      const image_url = formData.image_url
        ? formData.image_url
            .split(",")
            .map((img_url) => img_url.trim())
            .filter((img_url) => img_url)
        : [];

      const { data, error } = await supabase
        .from("stock_list")
        .insert([
          {
            title: formData.title,
            price: parseFloat(formData.price),
            year: parseInt(formData.year),
            miles_driven: formData.miles_driven,
            description: formData.description || null,
            attributes: attributes,
            is_available: formData.is_available,
            image_url: image_url,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car added to stock list successfully",
      });

      setFormData({
        title: "",
        price: "",
        year: "",
        miles_driven: "",
        description: "",
        attributes: "",
        is_available: true,
        image_url: "",
      });

      setIsAddDialogOpen(false);
      fetchStockItems();
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        title: "Error",
        description: "Failed to add car to stock list",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCar = async (id: string) => {
    try {
      const { error } = await supabase.from("stock_list").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car removed from stock list",
      });
      fetchStockItems();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Error",
        description: "Failed to remove car from stock list",
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from("stock_list")
        .update({ is_available: !isAvailable })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Car ${
          !isAvailable ? "marked as available" : "marked as sold"
        }`,
      });
      fetchStockItems();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast({
        title: "Error",
        description: "Failed to update car availability",
        variant: "destructive",
      });
    }
  };

  const markAsSold = async (id: string) => {
    try {
      const { error } = await supabase
        .from("stock_list")
        .update({ is_available: false })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Car marked as sold",
      });
      fetchStockItems();
    } catch (error) {
      console.error("Error marking car as sold:", error);
      toast({
        title: "Error",
        description: "Failed to mark car as sold",
        variant: "destructive",
      });
    }
  };

  // Filter items based on availability and search term
  const availableCars = stockItems.filter(
    (item) =>
      item.is_available &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const soldCars = stockItems.filter(
    (item) =>
      !item.is_available &&
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCarTable = (cars: stock_list[], showAsAvailable: boolean) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Mileage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.slice(0, 10).map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {item.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>£{Number(item.price).toLocaleString()}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.miles_driven} miles</TableCell>
              <TableCell>
                <Badge variant={showAsAvailable ? "default" : "secondary"}>
                  {showAsAvailable ? "Available" : "Sold"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {showAsAvailable ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => markAsSold(item.id)}
                    >
                      SOLD
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleAvailability(item.id, item.is_available)
                      }
                    >
                      Mark Available
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCar(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Stock List Management</CardTitle>
              <CardDescription>
                Manage cars available in your inventory
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Car to Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Car to Stock</DialogTitle>
                  <DialogDescription>
                    Enter the car details to add to your inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Car Title</Label>
                    <Input
                      id="title"
                      placeholder="2023 Mercedes-Benz C-Class"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (£)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="25000"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2023"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="miles_driven">Miles Driven</Label>
                    <Input
                      id="miles_driven"
                      placeholder="15,000"
                      value={formData.miles_driven}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          miles_driven: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Car description..."
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attributes">
                      Features (comma-separated)
                    </Label>
                    <Input
                      id="attributes"
                      placeholder="Leather Seats, Navigation, Bluetooth"
                      value={formData.attributes}
                      onChange={(e) =>
                        setFormData({ ...formData, attributes: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">
                      Image URL (add URLs comma-separated)
                    </Label>
                    <Textarea
                      id="image_url"
                      placeholder="https://..., https://...,https://..."
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_available: checked })
                      }
                    />
                    <Label htmlFor="is_available">Available for purchase</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCar}>Add Car</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">
                Available Cars ({availableCars.length})
              </TabsTrigger>
              <TabsTrigger value="sold">
                Sold Cars ({soldCars.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="mt-4">
              {renderCarTable(availableCars, true)}
            </TabsContent>

            <TabsContent value="sold" className="mt-4">
              {renderCarTable(soldCars, false)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStockManagement;
