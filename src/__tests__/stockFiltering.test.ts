import { describe, it, expect } from "vitest";
import { Car } from "@/components/CarCard";

// Mock cars data for testing
const mockCars: Car[] = [
  {
    id: 1,
    title: "Mercedes-Benz C-Class C220d AMG Line",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2018,
    price: 16500,
    description: "Diesel automatic with panoramic roof",
    imageUrl: ["https://example.com/c220.jpg"],
    mileage: 45000,
    features: ["Panoramic Roof", "Leather Seats", "Navigation"],
    isSold: false,
  },
  {
    id: 2,
    title: "Mercedes-Benz E-Class E350d V6 Premium Plus",
    make: "Mercedes-Benz",
    model: "E-Class",
    year: 2021,
    price: 32000,
    description: "Executive saloon with Burmester audio",
    imageUrl: ["https://example.com/e350.jpg"],
    mileage: 22000,
    features: ["Burmester Sound", "360 Camera", "Heated Seats"],
    isSold: false,
  },
  {
    id: 3,
    title: "Mercedes-Benz A-Class A180 Sport",
    make: "Mercedes-Benz",
    model: "A-Class",
    year: 2016,
    price: 8995,
    description: "Compact hatchback in pristine condition",
    imageUrl: ["https://example.com/a180.jpg"],
    mileage: 62000,
    features: ["Bluetooth", "Cruise Control", "Parking Sensors"],
    isSold: false,
  },
  {
    id: 4,
    title: "Mercedes-Benz GLC 250d 4MATIC AMG Night Edition",
    make: "Mercedes-Benz",
    model: "GLC",
    year: 2020,
    price: 26500,
    description: "4x4 SUV with full black styling package",
    imageUrl: ["https://example.com/glc.jpg"],
    mileage: 38000,
    features: ["4MATIC", "Night Package", "Privacy Glass"],
    isSold: false,
  },
];

describe("Stock Filtering & Sorting Operations", () => {
  it("filters cars by search keyword in model or title", () => {
    const query = "C-Class".toLowerCase();
    const matches = mockCars.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.model.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].model).toBe("C-Class");
  });

  it("filters cars by feature tag", () => {
    const query = "Burmester".toLowerCase();
    const matches = mockCars.filter((c) =>
      c.features.some((f) => f.toLowerCase().includes(query))
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe(2);
  });

  it("sorts cars by price ascending", () => {
    const sorted = [...mockCars].sort((a, b) => a.price - b.price);

    expect(sorted[0].price).toBe(8995);
    expect(sorted[sorted.length - 1].price).toBe(32000);
  });

  it("sorts cars by price descending", () => {
    const sorted = [...mockCars].sort((a, b) => b.price - a.price);

    expect(sorted[0].price).toBe(32000);
    expect(sorted[sorted.length - 1].price).toBe(8995);
  });

  it("sorts cars by year (newest first)", () => {
    const sorted = [...mockCars].sort((a, b) => b.year - a.year);

    expect(sorted[0].year).toBe(2021);
    expect(sorted[sorted.length - 1].year).toBe(2016);
  });

  it("sorts cars by mileage (lowest mileage first)", () => {
    const sorted = [...mockCars].sort((a, b) => a.mileage - b.mileage);

    expect(sorted[0].mileage).toBe(22000);
    expect(sorted[sorted.length - 1].mileage).toBe(62000);
  });

  it("filters accurately across defined price tiers", () => {
    const under10k = mockCars.filter((c) => c.price < 10000);
    expect(under10k).toHaveLength(1);
    expect(under10k[0].price).toBe(8995);

    const midRange = mockCars.filter((c) => c.price >= 10000 && c.price <= 20000);
    expect(midRange).toHaveLength(1);
    expect(midRange[0].price).toBe(16500);

    const premium = mockCars.filter((c) => c.price > 20000 && c.price <= 30000);
    expect(premium).toHaveLength(1);
    expect(premium[0].price).toBe(26500);

    const luxury = mockCars.filter((c) => c.price > 30000);
    expect(luxury).toHaveLength(1);
    expect(luxury[0].price).toBe(32000);
  });
});
