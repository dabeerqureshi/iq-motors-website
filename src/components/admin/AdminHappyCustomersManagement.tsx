import { useState, useRef } from "react";
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
import { Plus, Trash2, ExternalLink, Upload, X } from "lucide-react";
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
import { supabase } from "@/supabase/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const AdminHappyCustomersManagement = () => {
  const { customers, loading, addCustomer, deleteCustomer } =
    useHappyCustomers();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | number | null>(
    null
  );
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetSelectedFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      toast({
        title: "Invalid file",
        description: "Only JPEG/PNG/WebP images under 5MB are allowed",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    // Allow picking the same file again in a later selection.
    e.target.value = "";
  };

  const uploadCustomerPhoto = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `happy-customers/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("car-images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) {
      throw new Error(`Could not upload "${file.name}": ${error.message}`);
    }
    const { data } = supabase.storage.from("car-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAddCustomer = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please choose a photo to upload",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const publicUrl = await uploadCustomerPhoto(selectedFile);
      const { error } = await addCustomer(publicUrl);
      if (error) throw new Error(error);

      toast({
        title: "Success",
        description: "Happy customer added successfully",
      });
      resetSelectedFile();
      setIsAddDialogOpen(false);
    } catch (e) {
      toast({
        title: "Error",
        description: (e as Error).message || "Failed to add customer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this customer image? This action cannot be undone.")) {
      return;
    }

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
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) resetSelectedFile();
              }}
            >
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
                    Upload a photo of a happy customer. It will be shown on the
                    Happy Customers page.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerPhoto">Customer Photo</Label>
                    <p className="text-sm text-gray-500">
                      Select a JPEG/PNG/WebP image, max 5MB. It is uploaded to
                      Supabase Storage.
                    </p>

                    {previewUrl && (
                      <div className="relative inline-block w-24 h-24 rounded overflow-hidden bg-gray-200 border">
                        <img
                          src={previewUrl}
                          alt="Selected customer photo preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={resetSelectedFile}
                          aria-label="Remove selected photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Input
                        id="customerPhoto"
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      {previewUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={resetSelectedFile}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCustomer} disabled={isSubmitting}>
                    {isSubmitting ? "Uploading..." : "Add Customer"}
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
                    {deleteLoadingId === customer.id ? (
                      <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
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
