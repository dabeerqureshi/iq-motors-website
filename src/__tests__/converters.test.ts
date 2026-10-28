import { describe, it, expect } from "vitest";

interface RawStockItem {
  id: number;
  title: string;
  price: number | string;
  year: string | number;
  miles_driven: string | null;
  description: string | null;
  attributes: string[] | null;
  is_available: boolean;
  image_url: string[] | null;
}

const normalizeVehicle = (item: RawStockItem, isSold = false) => ({
  id: item.id,
  title: item.title,
  make: "Mercedes-Benz",
  model: item.title.split(" ").slice(-1)[0] || "Unknown",
  year: Number(item.year),
  price: Number(item.price),
  description: item.description || "",
  imageUrl: Array.isArray(item.image_url) ? item.image_url : [],
  mileage: parseInt((item.miles_driven || "0").replace(/,/g, "")) || 0,
  features: item.attributes || [],
  isSold,
});

describe("Vehicle Data Normalization", () => {
  it("normalizes raw database record with string year and formatted mileage", () => {
    const raw: RawStockItem = {
      id: 42,
      title: "Mercedes-Benz CLA CLA200 AMG Line",
      price: "18995",
      year: "2019",
      miles_driven: "48,250",
      description: "Full service history",
      attributes: ["Sunroof", "Reversing Camera"],
      is_available: true,
      image_url: ["https://example.com/cla.jpg"],
    };

    const normalized = normalizeVehicle(raw, false);

    expect(normalized.id).toBe(42);
    expect(normalized.year).toBe(2019);
    expect(normalized.price).toBe(18995);
    expect(normalized.mileage).toBe(48250);
    expect(normalized.features).toEqual(["Sunroof", "Reversing Camera"]);
    expect(normalized.isSold).toBe(false);
  });

  it("handles null or missing mileage, description, and images gracefully", () => {
    const raw: RawStockItem = {
      id: 99,
      title: "Mercedes-Benz Vito",
      price: 12000,
      year: 2015,
      miles_driven: null,
      description: null,
      attributes: null,
      is_available: false,
      image_url: null,
    };

    const normalized = normalizeVehicle(raw, true);

    expect(normalized.mileage).toBe(0);
    expect(normalized.description).toBe("");
    expect(normalized.imageUrl).toEqual([]);
    expect(normalized.features).toEqual([]);
    expect(normalized.isSold).toBe(true);
  });
});
