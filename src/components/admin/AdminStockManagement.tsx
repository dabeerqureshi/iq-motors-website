import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Pencil, Search, Upload, X, Tag, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

interface StockForm {
  title: string;
  price: string;
  year: string;
  miles_driven: string;
  description: string;
  attributes: string;
  is_available: boolean;
}

const createEmptyForm = (): StockForm => ({
  title: "",
  price: "",
  year: "",
  miles_driven: "",
  description: "",
  attributes: "",
  is_available: true,
});

const AdminStockManagement = () => {
  const [stockItems, setStockItems] = useState<stock_list[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCar, setEditingCar] = useState<stock_list | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<StockForm>(createEmptyForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const clearSelectedFiles = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles([]);
  };

  const resetForm = () => {
    setFormData(createEmptyForm());
    clearSelectedFiles();
    setExistingImages([]);
    setEditingCar(null);
  };

  const handleFormDialogChange = (open: boolean) => {
    setIsFormDialogOpen(open);
    if (!open) resetForm();
  };

  const openAddDialog = () => {
    resetForm();
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (car: stock_list) => {
    setEditingCar(car);
    setFormData({
      title: car.title ?? "",
      price: car.price != null ? String(car.price) : "",
      year: car.year != null ? String(car.year) : "",
      miles_driven:
        car.miles_driven != null
          ? String(car.miles_driven).replace(/[^\d]/g, "")
          : "",
      description: car.description ?? "",
      attributes: (car.attributes ?? []).join(", "),
      is_available: car.is_available,
    });
    setExistingImages(car.image_url ?? []);
    clearSelectedFiles();
    setIsFormDialogOpen(true);
  };

  const removeExistingImage = (url: string) => {
    setExistingImages(prev => prev.filter(image => image !== url));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter(f => ALLOWED_FILE_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE);
    if (valid.length < files.length) {
      toast({
        title: "Warning",
        description: `Skipped ${files.length - valid.length} file(s) - only JPEG/PNG/WebP under 5MB allowed`,
        variant: "destructive",
      });
    }
    const newPreviewUrls = valid.map(f => URL.createObjectURL(f));
    setSelectedFiles(prev => [...prev, ...valid]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    // Allow picking the same file again in a later selection.
    e.target.value = "";
  };

  const removePreview = (index: number) => {
    const removedUrl = previewUrls[index];
    if (removedUrl) URL.revokeObjectURL(removedUrl);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = 'car-images/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
      const { error } = await supabase.storage
        .from('car-images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        throw new Error(`Could not upload "${file.name}": ${error.message}`);
      }
      const { data: pub } = supabase.storage.from('car-images').getPublicUrl(path);
      urls.push(pub.publicUrl);
    }
    return urls;
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Make / Model is required';
    const price = Number(formData.price);
    if (!formData.price || !Number.isFinite(price) || price <= 0) return 'Enter a valid price';
    const year = Number(formData.year);
    const maxYear = new Date().getFullYear() + 1;
    if (!formData.year || !Number.isInteger(year) || year < 1900 || year > maxYear)
      return `Enter a valid year between 1900 and ${maxYear}`;
    return null;
  };

  const handleSaveCar = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast({ title: 'Check the form', description: validationError, variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const newImageUrls = await uploadImages(selectedFiles);
      const payload = {
        title: formData.title.trim(),
        price: Number(formData.price),
        year: Number(formData.year),
        miles_driven: formData.miles_driven.replace(/,/g, '').trim(),
        description: formData.description.trim() || null,
        attributes: formData.attributes
          ? formData.attributes.split(',').map(s => s.trim()).filter(Boolean)
          : null,
        is_available: formData.is_available,
        image_url: [...existingImages, ...newImageUrls],
      };

      if (editingCar) {
        const { error } = await supabase.from('stock_list').update(payload).eq('id', editingCar.id);
        if (error) throw error;
        toast({ title: 'Vehicle updated', description: `${payload.title} has been updated successfully` });
      } else {
        const { error } = await supabase.from('stock_list').insert([payload]);
        if (error) throw error;
        toast({ title: 'Car added', description: `${payload.title} has been listed successfully` });
      }

      handleFormDialogChange(false);
      fetchStockItems();
    } catch (e) {
      toast({
        title: editingCar ? 'Update failed' : 'Add failed',
        description: (e as Error).message || (editingCar ? 'Could not update vehicle' : 'Could not add car'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchStockItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stock_list').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setStockItems((data ?? []) as stock_list[]);
    } catch (e) {
      toast({ title: 'Fetch failed', description: (e as Error).message || 'Could not load stock', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStockItems(); }, []);

  const handleDeleteCar = async (id: string) => {
    if (!window.confirm('Delete this vehicle? This cannot be undone.')) return;
    setDeleteLoadingId(id);
    try {
      const { error } = await supabase.from('stock_list').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Vehicle removed', variant: 'default' });
      fetchStockItems();
    } catch (e) {
      toast({ title: 'Delete failed', description: (e as Error).message || 'Could not delete vehicle', variant: 'destructive' });
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleMoveCar = async (car: stock_list) => {
    const toSold = car.is_available;
    setMovingId(car.id);
    try {
      const { error } = await supabase
        .from('stock_list')
        .update({ is_available: !car.is_available })
        .eq('id', car.id);
      if (error) throw error;
      toast({
        title: toSold ? 'Moved to Sold' : 'Moved to Available',
        description: toSold
          ? `${car.title} has been moved to the Sold list`
          : `${car.title} is now listed as available`,
      });
      fetchStockItems();
    } catch (e) {
      toast({
        title: toSold ? 'Move failed' : 'Restore failed',
        description: (e as Error).message || 'Could not update the vehicle',
        variant: 'destructive',
      });
    } finally {
      setMovingId(null);
    }
  };

  const availableCars = stockItems.filter(c => c.is_available && (!searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase())));
  const soldCars = stockItems.filter(c => !c.is_available && (!searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase())));

  const renderTable = (cars: stock_list[], showAvail: boolean) => {
    if (loading) return (  <div className='space-y-4 py-8'><Skeleton className='h-6 w-full' /><Skeleton className='h-6 w-3/4' /><Skeleton className='h-6 w-1/2' /></div>);

    if (cars.length === 0)
      return (  <p className='text-center text-gray-500 py-10'>{showAvail ? 'No available cars' : 'No sold cars'}</p>);

    return (
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader><TableRow><TableHead>Make / Model</TableHead><TableHead>Price</TableHead><TableHead>Year</TableHead><TableHead>Mileage</TableHead><TableHead>Available</TableHead><TableHead className='text-right'>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {cars.map(car => (
              <TableRow key={car.id}>
                <TableCell className='font-medium'>{car.title}</TableCell>
                <TableCell>£{Number(car.price).toLocaleString('en-GB')}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>{car.miles_driven} miles</TableCell>
                <TableCell>
                  <Badge variant={car.is_available ? 'default' : 'secondary'}>
                    {car.is_available ? 'Available' : 'Sold'}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    {car.is_available ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleMoveCar(car)}
                        disabled={movingId === car.id || deleteLoadingId === car.id}
                        aria-label={`Mark ${car.title} as sold`}
                      >
                        <Tag className='w-4 h-4 mr-1' />
                        {movingId === car.id ? 'Moving...' : 'Mark Sold'}
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleMoveCar(car)}
                        disabled={movingId === car.id || deleteLoadingId === car.id}
                        aria-label={`Move ${car.title} back to available`}
                      >
                        <RotateCcw className='w-4 h-4 mr-1' />
                        {movingId === car.id ? 'Moving...' : 'Back to Available'}
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => openEditDialog(car)}
                      disabled={movingId === car.id || deleteLoadingId === car.id}
                      aria-label={`Edit ${car.title}`}
                    >
                      <Pencil className='w-4 h-4 mr-1' />
                      Edit
                    </Button>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDeleteCar(car.id)}
                      disabled={movingId === car.id || deleteLoadingId === car.id}
                      aria-label={`Delete ${car.title}`}
                    >
                      <Trash2 className='w-4 h-4 mr-1' />
                      {deleteLoadingId === car.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className='bg-cardealer-surface text-cardealer-dark shadow-lg border border-cardealer-secondary'>
      <CardHeader className='border-b border-cardealer-secondary'><CardTitle className='text-xl'>Admin Stock Panel</CardTitle></CardHeader>
      <CardContent>
        <div className='flex items-center flex-wrap gap-2 mb-4'>
          <Search className='w-4 h-4 text-gray-400' />
          <Input placeholder='Search cars...' className='max-w-sm' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>

        <Tabs defaultValue={'available'} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value={'available'}>{availableCars.length} Available</TabsTrigger>
            <TabsTrigger value={'sold'}>{soldCars.length} Sold</TabsTrigger>
          </TabsList>

          <TabsContent value={'available'}>
            {renderTable(availableCars, true)}
          </TabsContent>
          <TabsContent value={'sold'}>
            {renderTable(soldCars, false)}
          </TabsContent>
        </Tabs>

        <Dialog open={isFormDialogOpen} onOpenChange={handleFormDialogChange}>
          <DialogTrigger asChild>
            <Button className='mt-4' onClick={openAddDialog}>
              <Plus className='w-4 h-4 mr-2' /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className='bg-cardealer-surface text-cardealer-dark sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-cardealer-dark'>
                {editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
              </DialogTitle>
              <DialogDescription>
                {editingCar
                  ? 'Update the details below and save your changes. Current images are kept unless you remove them.'
                  : 'Fill in the vehicle details and add images. Make / Model, Price and Year are required.'}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Make / Model</Label>
                <Input id='title' placeholder='Mercedes-Benz C-Class' value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price (£)</Label>
                <Input id='price' type='number' min='0' placeholder='25000' value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='year'>Year</Label>
                <Input id='year' type='number' min='1900' placeholder='2020' value={formData.year} onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='miles'>Mileage</Label>
                <Input id='miles' type='number' min='0' placeholder='15000' value={formData.miles_driven} onChange={e => setFormData(prev => ({ ...prev, miles_driven: e.target.value }))} />
              </div>
              <div className='space-y-2 sm:col-span-2'>
                <Label htmlFor='desc'>Description</Label>
                <Textarea id='desc' placeholder='AutoTrader award winner...' value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className='space-y-2 sm:col-span-2'>
                <Label htmlFor='attrs'>Features (comma separated)</Label>
                <Input id='attrs' placeholder='Leather seats, navigation, w205 estate' value={formData.attributes} onChange={e => setFormData(prev => ({ ...prev, attributes: e.target.value }))} />
              </div>
            </div>

            <div className='mt-4 border-t pt-4 space-y-3'>
              {editingCar && existingImages.length > 0 && (
                <div>
                  <Label>Current images</Label>
                  <p className='text-sm text-gray-500 mb-2'>
                    Remove any images you no longer want on this listing.
                  </p>
                  <div className='flex flex-wrap gap-3'>
                    {existingImages.map((url, index) => (
                      <div key={`${index}-${url}`} className='relative inline-block w-24 h-24 rounded overflow-hidden bg-gray-200 border border-cardealer-secondary'>
                        <img src={url} alt='Current vehicle' className='w-full h-full object-cover' />
                        <button
                          type='button'
                          className='absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center'
                          onClick={() => removeExistingImage(url)}
                          aria-label='Remove current image'
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor='files'>{editingCar ? 'Add new images' : 'Vehicle Images'}</Label>
                <p className='text-sm text-gray-500 mb-2'>Select JPEG/PNG/WebP, max 5MB each. Uploaded to your Supabase Storage (car-images bucket).</p>

                {previewUrls.length > 0 && (
                  <div className='flex flex-wrap gap-3 mb-3'>
                    {previewUrls.map((url, i) => (
                      <div key={url} className='relative inline-block w-24 h-24 rounded overflow-hidden bg-gray-200'>
                        <img src={url} alt={`New image preview ${i + 1}`} className='w-full h-full object-cover' />
                        <button type='button' className='absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center' onClick={() => removePreview(i)} aria-label='Remove image'>
                          <X className='w-3 h-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className='flex items-center gap-2'>
                  <Input
                    id='files'
                    type='file'
                    accept='image/jpeg, image/png, image/webp'
                    multiple
                    className='hidden'
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <Button type='button' variant='outline' id='add-images-btn' onClick={() => fileInputRef.current?.click()}>
                    <Upload className='w-4 h-4 mr-2' /> Add Images
                  </Button>
                  {previewUrls.length > 0 && (
                    <Button type='button' variant='ghost' id='clear-images-btn' onClick={clearSelectedFiles}>
                      <X className='w-4 h-4 mr-2' /> Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-3 mt-3'>
              <Switch id='avail' checked={formData.is_available} onCheckedChange={checked => setFormData(prev => ({ ...prev, is_available: checked }))} />
              <Label htmlFor='avail'>Available for sale</Label>
            </div>

            <div className='flex justify-end gap-2 mt-5'>
              <Button variant='outline' onClick={() => handleFormDialogChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveCar} disabled={isSaving}>
                {isSaving ? (
                  <span className='flex items-center gap-2'>
                    <span className='animate-pulse w-4 h-4 bg-gray-300 rounded-full' />
                    Saving
                  </span>
                ) : editingCar ? (
                  'Save Changes'
                ) : (
                  'Add Vehicle'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminStockManagement;
