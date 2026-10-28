import type { Car } from "@/components/CarCard";

/**
 * Raw `stock_list` row as it comes back from PostgREST. The columns are loosely
 * typed because the table has changed shape over time: `year` and `miles_driven`
 * are text columns, and early rows stored `image_url` as a scalar string rather
 * than an array.
 */
export interface StockRow {
  id: string | number;
  title: string;
  price: number | string | null;
  year: string | number | null;
  miles_driven: string | number | null;
  description: string | null;
  attributes: unknown;
  is_available?: boolean | null;
  image_url: unknown;
}

/** Image column -> string[] (missing values, or a legacy scalar, become empty/1 item). */
export const normaliseImages = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }
  return [];
};

/** Feature column -> string[] (null, "" and legacy comma-separated text all handled). */
export const normaliseFeatures = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "string" && item.trim().length > 0)
      .map((item) => (item as string).trim());
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

/** "12,500", "12500 miles", 12500 -> 12500; anything unusable -> 0 (UI shows "on request"). */
export const normaliseMileage = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
  }
  const digits = String(value ?? "").replace(/[^\d]/g, "");
  const miles = Number(digits);
  return Number.isFinite(miles) && miles > 0 ? miles : 0;
};

/** 2019 / "2019" -> 2019; anything unusable -> 0 (UI hides the badge). */
export const normaliseYear = (value: unknown): number => {
  const year = Number(String(value ?? "").replace(/[^\d]/g, ""));
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : 0;
};

/** 24995 / "24,995" -> 24995; anything unusable -> 0 (UI shows "Price on request"). */
export const normalisePrice = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : 0;
  }
  const digits = String(value ?? "").replace(/[^\d.]/g, "");
  const price = Number(digits);
  return Number.isFinite(price) && price > 0 ? price : 0;
};

/**
 * Titles are written as "Mercedes-Benz C-Class Estate", so the model is the
 * title with the make prefix stripped. The previous implementation took the
 * *last word* of the title, which listed every estate car as model "Estate" on
 * the vehicle page and broke model searches.
 */
export const deriveModel = (title: string): string => {
  const withoutMake = title
    .replace(/^\s*(mercedes[-\s]?benz|mercedes|benz)\s+/i, "")
    .trim();
  return withoutMake || title.trim();
};

/** Single place where a database row becomes the shape the UI renders. */
export const toCar = (row: StockRow, isSold = false): Car => {
  const title = row.title?.trim() || "Untitled vehicle";

  return {
    id: row.id,
    title,
    make: "Mercedes-Benz",
    model: deriveModel(title),
    year: normaliseYear(row.year),
    price: normalisePrice(row.price),
    description: row.description?.trim() || "",
    imageUrl: normaliseImages(row.image_url),
    mileage: normaliseMileage(row.miles_driven),
    features: normaliseFeatures(row.attributes),
    isSold: isSold || row.is_available === false,
  };
};
