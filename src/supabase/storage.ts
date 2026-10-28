import { supabase } from "@/supabase/supabase";

/**
 * Single bucket shared by vehicle photos (`car-images/...`) and happy-customer
 * photos (`happy-customers/...`).
 */
export const CAR_IMAGES_BUCKET = "car-images";

export interface UploadedObject {
  /** Public URL as stored in the database column. */
  url: string;
  /** Storage key, needed if the row write fails and we have to roll back. */
  path: string;
}

/**
 * Public Supabase Storage URLs look like
 * `https://<ref>.supabase.co/storage/v1/object/public/car-images/car-images/123-abc.jpg`.
 * The storage key is everything after the bucket name in the path. Anything we
 * cannot parse returns null so we never delete an object we do not own.
 */
export const storagePathFromPublicUrl = (url: string): string | null => {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${CAR_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const path = url.slice(index + marker.length).split("?")[0];
  return path ? decodeURIComponent(path) : null;
};

/**
 * Best-effort cleanup of storage objects. Never throws: if the bucket policies
 * block the delete we log it and carry on, because the database change the
 * admin asked for has already succeeded.
 */
export const removeStoragePaths = async (paths: string[]): Promise<string[]> => {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return [];
  const { error } = await supabase.storage.from(CAR_IMAGES_BUCKET).remove(unique);
  if (error) {
    console.warn("Storage cleanup failed:", error.message);
    return [];
  }
  return unique;
};

/** Same as {@link removeStoragePaths} but takes the public URLs from the DB. */
export const removeStorageUrls = async (urls: string[]): Promise<string[]> => {
  const paths = urls
    .map(storagePathFromPublicUrl)
    .filter((path): path is string => Boolean(path));
  return removeStoragePaths(paths);
};

/**
 * Uploads a batch of files and returns their public URLs plus storage keys.
 * If any upload in the batch fails, the files already uploaded are removed
 * again so a failed save cannot leave orphaned objects in the bucket.
 */
export const uploadImages = async (
  files: File[],
  folder = "car-images"
): Promise<UploadedObject[]> => {
  const uploaded: UploadedObject[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(CAR_IMAGES_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      await removeStoragePaths(uploaded.map((item) => item.path));
      throw new Error(`Could not upload "${file.name}": ${error.message}`);
    }

    const { data } = supabase.storage
      .from(CAR_IMAGES_BUCKET)
      .getPublicUrl(path);

    uploaded.push({ url: data.publicUrl, path });
  }

  return uploaded;
};
