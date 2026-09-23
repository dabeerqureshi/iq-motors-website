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
import {
  removeStoragePaths,
  removeStorageUrls,
  uploadImages,
  type UploadedObject,
} from "@/supabase/storage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  normaliseFeatures,
  normaliseImages,
  normaliseMileage,
  normalisePrice,
  normaliseYear,
} from "@/lib/stock";

/**
 * Raw `stock_list` row as PostgREST returns it. Deliberately loose: the table has
 * changed shape over time (`year`/`miles_driven` are text columns, `price` can be
 * text, and `image_url`/`attributes` may hold a legacy scalar string instead of
 * an array).
 */
interface stock_list {
  id: string | number;
  title: string | null;
  price: number | string | null;
  year: number | string | null;
  miles_driven: string | number | null;
  description: string | null;
  attributes: unknown;
  is_available: boolean | null;
  image_url: unknown;
  created_at: string | null;
}

/**
 * What the panel renders: a `stock_list` row run through the same normalisers the
 * public site uses (src/lib/stock.ts). Without this, one hand-edited row (scalar
 * `image_url`, comma-separated `attributes`, NULL `is_available`) threw
 * "… .join is not a function" and killed the Edit dialog.
 */
interface StockItem {
  id: string | number;
  title: string;
  price: number;
  year: number;
  miles_driven: number;
  description: string | null;
  attributes: string[];
  is_available: boolean;
  image_url: string[];
  created_at: string | null;
}

/** Only an explicit `false` means sold - NULL (older rows) counts as available. */
const isSoldRow = (row: { is_available: boolean | null }): boolean =>
  row.is_available === false;

const toStockItem = (row: stock_list): StockItem => ({
  id: row.id,
  title: row.title?.trim() || "Untitled vehicle",
  price: normalisePrice(row.price),
  year: normaliseYear(row.year),
  miles_driven: normaliseMileage(row.miles_driven),
  description: row.description ?? null,
  attributes: normaliseFeatures(row.attributes),
  is_available: !isSoldRow(row),
  image_url: normaliseImages(row.image_url),
  created_at: row.created_at ?? null,
});

/** The parts of a PostgREST/JS failure worth showing to an admin. */
interface WriteError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
}

/**
 * PostgREST reports a write that RLS filtered to 0 rows as a *success* with no
 * error, so an empty result has to be treated as a failure - and explained.
 */
const describeZeroRows = (action: string): string =>
  `The server accepted the request but ${action} changed 0 rows. That normally means a ` +
  "row-level security policy filtered it out (an expired admin session looks the same). " +
  "Sign out and back in, then retry - if it keeps failing, run sql/enable_rls.sql " +
  "(see sql/diagnose_admin_writes.sql) in the Supabase SQL editor.";

/** Turn a failed write into something the admin can act on. */
const describeWriteError = (error: unknown): string => {
  const { message = "", code = "", details = "", hint = "" } = (error ?? {}) as WriteError;

  if (code === "42501" || /row-level security/i.test(message)) {
    return (
      `${message || "The database refused this write (row-level security)."} ` +
      `Run sql/enable_rls.sql in the Supabase SQL editor.${hint ? ` (${hint})` : ""}`
    );
  }
  if (isAuthFailure(error)) {
    return "Your admin session is no longer valid — sign out and sign in again, then retry.";
  }
  return (
    [message, code && `code ${code}`, details, hint].filter(Boolean).join(" · ") ||
    "The request failed for an unknown reason."
  );
};

/** True when the request went out without a usable admin session. */
const isAuthFailure = (error: unknown): boolean => {
  const { message = "", code = "", status } = (error ?? {}) as WriteError;
  if (code === "42501" || /row-level security/i.test(message)) return false;
  return (
    status === 401 ||
    status === 403 ||
    code === "PGRST301" ||
    /jwt|token|not authenticated/i.test(message)
  );
};

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
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | number | null>(null);
  const [movingId, setMovingId] = useState<string | number | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCar, setEditingCar] = useState<StockItem | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { toast } = useToast();
  const { logout } = useAuth();
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

  /**
   * Single place where a failed write becomes UI: an expired/invalid session
   * drops the admin back to the sign-in form instead of leaving them clicking a
   * button that can never succeed.
   */
  const reportWriteFailure = async (title: string, error: unknown) => {
    if (isAuthFailure(error)) {
      toast({
        title: 'Session expired',
        description: 'Your admin session is no longer valid. Please sign in again.',
        variant: 'destructive',
      });
      await logout();
      return;
    }
    toast({ title, description: describeWriteError(error), variant: 'destructive' });
  };

  const openEditDialog = (car: StockItem) => {
    setEditingCar(car);
    setFormData({
      title: car.title,
      price: car.price > 0 ? String(car.price) : "",
      year: car.year > 0 ? String(car.year) : "",
      miles_driven: car.miles_driven > 0 ? String(car.miles_driven) : "",
      description: car.description ?? "",
      attributes: car.attributes.join(", "),
      is_available: car.is_available,
    });
    setExistingImages(car.image_url);
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

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Make / Model is required';
    const price = Number(formData.price);
    if (!formData.price.trim() || !Number.isFinite(price) || price <= 0) return 'Enter a valid price';
    if (price > 10000000) return 'That price looks unrealistically high - please check it';
    const year = Number(formData.year);
    const maxYear = new Date().getFullYear() + 1;
    if (!formData.year || !Number.isInteger(year) || year < 1900 || year > maxYear)
      return `Enter a valid year between 1900 and ${maxYear}`;
    const mileage = formData.miles_driven.replace(/[\s,]/g, '');
    if (mileage) {
      const miles = Number(mileage);
      if (!/^\d+$/.test(mileage) || miles > 2000000)
        return 'Enter mileage as a whole number between 0 and 2,000,000 (or leave it blank)';
    }
    return null;
  };

  const handleSaveCar = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast({ title: 'Check the form', description: validationError, variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    // Images the admin removed while editing - deleted from storage only after
    // the row update succeeds, so a failed save never loses photos.
    const removedImages = editingCar
      ? (editingCar.image_url ?? []).filter(url => !existingImages.includes(url))
      : [];
    let uploaded: UploadedObject[] = [];

    try {
      uploaded = await uploadImages(selectedFiles);
      const payload = {
        title: formData.title.trim(),
        price: Number(formData.price),
        year: Number(formData.year),
        miles_driven: formData.miles_driven.replace(/[\s,]/g, '').trim(),
        description: formData.description.trim() || null,
        attributes: formData.attributes
          ? formData.attributes.split(',').map(s => s.trim()).filter(Boolean)
          : null,
        is_available: formData.is_available,
        image_url: [...existingImages, ...uploaded.map(item => item.url)],
      };

      if (editingCar) {
        // Request the updated rows back: RLS can silently filter an UPDATE to
        // 0 rows (PostgREST reports success with no error), so without this a
        // blocked edit would be reported as "Vehicle updated".
        const { data, error } = await supabase
          .from('stock_list')
          .update(payload)
          .eq('id', editingCar.id)
          .select('id');
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error(describeZeroRows('this update'));
        }
        toast({ title: 'Vehicle updated', description: `${payload.title} has been updated successfully` });
      } else {
        // Same trick as the update path: an INSERT blocked by RLS returns no
        // rows, which would otherwise look like a success.
        const { data, error } = await supabase.from('stock_list').insert([payload]).select('id');
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error(describeZeroRows('this listing'));
        }
        toast({ title: 'Car added', description: `${payload.title} has been listed successfully` });
      }

      if (removedImages.length > 0) {
        await removeStorageUrls(removedImages);
      }

      handleFormDialogChange(false);
      fetchStockItems();
    } catch (e) {
      // Roll the whole upload back so a failed save cannot orphan files.
      if (uploaded.length > 0) {
        await removeStoragePaths(uploaded.map(item => item.path));
      }
      await reportWriteFailure(editingCar ? 'Update failed' : 'Add failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchStockItems = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const { data, error } = await supabase
        .from('stock_list').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      // Normalise once, here: a legacy/hand-edited row (null title, scalar
      // image_url, comma-separated attributes, NULL flags) must never break the
      // table render or the Edit dialog.
      setStockItems(((data ?? []) as stock_list[]).map(toStockItem));
    } catch (e) {
      const message = describeWriteError(e) || 'Could not load stock';
      // Keep this visible in the panel too: a toast disappears and the table
      // would otherwise look like an empty inventory.
      setLoadError(message);
      toast({ title: 'Fetch failed', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStockItems(); }, []);

  const handleDeleteCar = async (car: StockItem) => {
    if (!window.confirm('Delete this vehicle? This cannot be undone.')) return;
    const id = car.id;
    setDeleteLoadingId(id);
    try {
      const { data, error } = await supabase.from('stock_list').delete().eq('id', id).select('id');
      if (error) throw error;
      // RLS can silently filter the DELETE to 0 rows; surface that as a failure.
      if (!data || data.length === 0) {
        throw new Error(describeZeroRows('this deletion'));
      }
      // Row is gone, so its photos are unreachable from the site: clean them up
      // (best effort - the delete above already succeeded).
      if (car.image_url.length > 0) {
        await removeStorageUrls(car.image_url);
      }
      toast({ title: 'Deleted', description: 'Vehicle removed', variant: 'default' });
      fetchStockItems();
    } catch (e) {
      await reportWriteFailure('Delete failed', e);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleMoveCar = async (car: StockItem) => {
    const toSold = car.is_available;
    setMovingId(car.id);
    try {
      const { data, error } = await supabase
        .from('stock_list')
        .update({ is_available: !car.is_available })
        .eq('id', car.id)
        .select('id');
      if (error) throw error;
      // RLS can silently filter the UPDATE to 0 rows; surface that instead of
      // pretending the move succeeded.
      if (!data || data.length === 0) {
        throw new Error(describeZeroRows('this change'));
      }
      toast({
        title: toSold ? 'Moved to Sold' : 'Moved to Available',
        description: toSold
          ? `${car.title} has been moved to the Sold list`
          : `${car.title} is now listed as available`,
      });
      fetchStockItems();
    } catch (e) {
      await reportWriteFailure(toSold ? 'Move failed' : 'Restore failed', e);
    } finally {
      setMovingId(null);
    }
  };

  const matchesSearch = (car: StockItem) =>
    !searchTerm || car.title.toLowerCase().includes(searchTerm.toLowerCase());

  const availableCars = stockItems.filter(car => car.is_available && matchesSearch(car));
  const soldCars = stockItems.filter(car => !car.is_available && matchesSearch(car));

  const formatPrice = (price: number) =>
    price > 0 ? `£${price.toLocaleString('en-GB')}` : 'POA';
  const formatMileage = (miles: number) =>
    miles > 0 ? `${miles.toLocaleString('en-GB')} miles` : 'n/a';

  const renderTable = (cars: StockItem[], showAvail: boolean) => {
    if (loading) return (  <div className='space-y-4 py-8'><Skeleton className='h-6 w-full' /><Skeleton className='h-6 w-3/4' /><Skeleton className='h-6 w-1/2' /></div>);

    if (loadError)
      return (
        <div className='text-center py-10 space-y-3' role='alert'>
          <p className='font-medium text-cardealer-dark'>Could not load the stock list</p>
          <p className='text-sm text-gray-500 break-words'>{loadError}</p>
          <Button variant='outline' onClick={fetchStockItems}>
            <RotateCcw className='w-4 h-4 mr-2' /> Try again
          </Button>
        </div>
      );

    if (cars.length === 0)
      return (
        <p className='text-center text-gray-500 py-10'>
          {searchTerm
            ? `No ${showAvail ? 'available' : 'sold'} cars match “${searchTerm}”`
            : showAvail
              ? 'No available cars'
              : 'No sold cars'}
        </p>
      );

    const renderActions = (car: StockItem) => (
      <div className='flex flex-wrap justify-end gap-2'>
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
          onClick={() => handleDeleteCar(car)}
          disabled={movingId === car.id || deleteLoadingId === car.id}
          aria-label={`Delete ${car.title}`}
        >
          <Trash2 className='w-4 h-4 mr-1' />
          {deleteLoadingId === car.id ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    );

    return (
      <>
        {/* Mobile: card list (tables don't fit narrow screens) */}
        <div className='md:hidden space-y-3'>
          {cars.map(car => (
            <div key={car.id} className='rounded-lg border p-4 space-y-3 bg-white'>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='font-medium break-words'>{car.title}</p>
                  <p className='text-sm text-gray-500'>
                    {formatPrice(car.price)} · {car.year || '–'} · {formatMileage(car.miles_driven)}
                  </p>
                </div>
                <Badge variant={car.is_available ? 'default' : 'secondary'}>
                  {car.is_available ? 'Available' : 'Sold'}
                </Badge>
              </div>
              {renderActions(car)}
            </div>
          ))}
        </div>

        {/* Desktop: full table */}
        <div className='hidden md:block overflow-x-auto'>
          <Table>
            <TableHeader><TableRow><TableHead>Make / Model</TableHead><TableHead>Price</TableHead><TableHead>Year</TableHead><TableHead>Mileage</TableHead><TableHead>Available</TableHead><TableHead className='text-right'>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {cars.map(car => (
                <TableRow key={car.id}>
                  <TableCell className='font-medium'>{car.title}</TableCell>
                  <TableCell>{formatPrice(car.price)}</TableCell>
                  <TableCell>{car.year || '–'}</TableCell>
                  <TableCell>{formatMileage(car.miles_driven)}</TableCell>
                  <TableCell>
                    <Badge variant={car.is_available ? 'default' : 'secondary'}>
                      {car.is_available ? 'Available' : 'Sold'}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    {renderActions(car)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  return (
    <Card className='bg-cardealer-surface text-cardealer-dark shadow-lg border border-cardealer-secondary'>
      <CardHeader className='border-b border-cardealer-secondary'><CardTitle className='text-xl'>Admin Stock Panel</CardTitle></CardHeader>
      <CardContent>
        <div className='flex items-center flex-wrap gap-2 mb-4'>
          <Search className='w-4 h-4 text-gray-400' aria-hidden />
          <Input
            type='search'
            placeholder='Search cars...'
            aria-label='Search stock by make or model'
            className='w-full max-w-sm'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setSearchTerm('')}
              aria-label='Clear search'
            >
              <X className='w-4 h-4 mr-1' /> Clear
            </Button>
          )}
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
                <Input id='miles' type='number' min='0' step='1' inputMode='numeric' placeholder='15000' value={formData.miles_driven} onChange={e => setFormData(prev => ({ ...prev, miles_driven: e.target.value }))} />
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

            <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-5'>
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
