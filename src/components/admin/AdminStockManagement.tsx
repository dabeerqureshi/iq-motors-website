import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Search, Upload, X, Image as ImageIcon } from "lucide-react";
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

const AdminStockManagement = () => {
  const [stockItems, setStockItems] = useState<stock_list[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "", price: "", year: "", miles_driven: "", description: "", attributes: "", is_available: true,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
    const newFiles = [...selectedFiles, ...valid];
    setSelectedFiles(newFiles);
    setPreviewUrls(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
  };

  const removePreview = (index: number) => {
    const updated = [...previewUrls];
    const removedUrl = updated[index];
    updated.splice(index, 1);
    setPreviewUrls(updated);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(removedUrl);
  };

  const handleSelectedFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e);
  };

  const uploadImages = async (): Promise<string[]> => {
    setUploadLoading(true);
    const urls: string[] = [];
    for (const file of selectedFiles) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
      const path = 'car-images/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        toast({ title: 'Image upload failed', description: error.message, variant: 'destructive' });
      } else {
        const { data: pub } = supabase.storage.from('car-images').getPublicUrl(path);
        urls.push(pub.publicUrl);
      }
    }
    setUploadLoading(false);
    return urls;
  };

  const handleAddCar = async () => {
    if (!formData.title || !formData.price || !formData.year) {
      toast({ title: 'Missing fields', description: 'Title, price, and year are required', variant: 'destructive' });
      return;
    }
    try {
      setUploadLoading(true);
      const urls = await uploadImages();
      const car = {
        title: formData.title,
        price: parseFloat(formData.price),
        year: parseInt(formData.year, 10),
        miles_driven: formData.miles_driven,
        description: formData.description || null,
        attributes: formData.attributes ? formData.attributes.split(',').map(s => s.trim()).filter(Boolean) : null,
        is_available: formData.is_available,
        image_url: urls,
      };
      const { error } = await supabase.from('stock_list').insert([car]).select();
      if (error) throw error;
      toast({ title: 'Car added', description: formData.title + ' has been listed successfully', variant: 'default' });
      setIsAddDialogOpen(false);
      setFormData({ title: '', price: '', year: '', miles_driven: '', description: '', attributes: '', is_available: true });
      setSelectedFiles([]);
      setPreviewUrls([]);
      fetchStockItems();
    } catch (e) {
      toast({ title: 'Add failed', description: (e as Error).message || 'Could not add car', variant: 'destructive' });
    } finally {
      setUploadLoading(false);
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

  const availableCars = stockItems.filter(c => c.is_available && (!searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase())));
  const soldCars = stockItems.filter(c => !c.is_available && (!searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase())));

  const renderTable = (cars: stock_list[], showAvail: boolean) => {
    if (loading) return (  <div className='space-y-4 py-8'><Skeleton className='h-6 w-full' /><Skeleton className='h-6 w-3/4' /><Skeleton className='h-6 w-1/2' /></div>);

    const M = () => (<p className='text-xs text-gray-400'>No columns</p>);
    if (cars.length === 0)
      return (  <p className='text-center text-gray-500 py-10'>{showAvail ? 'No available cars' : 'No sold cars'}</p>);

    return (
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader><TableRow><TableHead>Make / Model</TableHead><TableHead>Price</TableHead><TableHead>Year</TableHead><TableHead>Mileage</TableHead><TableHead>Available</TableHead><TableHead className='text-right'>Actions</TableHead></TableRow></TableHeader>
          <TableBody></TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className='bg-cardealer-surface text-[#fff] shadow-lg border cardealer-secondary'>
      <CardHeader className='border-b cardealer-secondary'><CardTitle className='text-xl'>Admin Stock Panel</CardTitle></CardHeader>
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className='mt-4'>Add Vehicle</Button></DialogTrigger>
          <DialogContent className='bg-cardealer-surface text-gray-900'>
            <DialogHeader><DialogTitle>Add New Vehicle</DialogTitle></DialogHeader>
            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Make / Model</Label>
                <Input id='title' placeholder='Mercedes-Benz C-Class' value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='price'>Price (£)</Label>
                <Input id='price' type='number' placeholder='25000' value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='year'>Year</Label>
                <Input id='year' type='number' placeholder='2020' value={formData.year} onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='miles'>Mileage</Label>
                <Input id='miles' type='number' placeholder='15000' value={formData.miles_driven} onChange={e => setFormData(prev => ({ ...prev, miles_driven: e.target.value }))} />
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

            <div className='mt-4 border-t pt-4'>
              <Label htmlFor='files'>Vehicle Images</Label>
              <p className='text-sm text-gray-500 mb-2'>Select JPEG/PNG/WebP, max 5MB each. Uploaded to your Supabase Storage (car-images bucket).</p>

              {previewUrls.length > 0 && (
                <div className='flex flex-wrap gap-3 mb-3'>
                  {previewUrls.map((url, i) => (
                    <div key={i} className='relative inline-block w-24 h-24 rounded overflow-hidden bg-gray-200'>
                      <img src={url} alt={('preview ' + i) + ''} className='w-full h-full object-cover' />
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
                  accept='image/jpeg, image/png, image/webp' multiple
                  className='hidden'
                  ref={fileInputRef}
                  onChange={handleSelectedFilesChange}
                />
                <Button variant='outline' id='add-images-btn' onClick={() => fileInputRef.current?.click()}>
                  <Upload className='w-4 h-4 mr-2' /> Add Images
                </Button>
                {previewUrls.length > 0 && (
                  <Button variant='ghost' id='clear-images-btn' onClick={() => { setPreviewUrls([]); setSelectedFiles([]); }}>
                    <X className='w-4 h-4 mr-2' /> Clear
                  </Button>
                )}
              </div>
            </div>

            <div className='flex items-center space-x-3 mt-3'>
              <Switch id='avail' checked={formData.is_available} onCheckedChange={checked => setFormData(prev => ({ ...prev, is_available: checked }))} />
              <Label htmlFor='avail'>Available for sale</Label>
            </div>

            <div className='flex justify-end gap-2 mt-5'>
              <Button variant='outline' onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCar} disabled={uploadLoading}>
                {uploadLoading ? <span className='flex items-center gap-2'><span className='animate-pulse w-4 h-4 bg-gray-300 rounded-full' />Saving</span> : 'Add Vehicle'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminStockManagement;
