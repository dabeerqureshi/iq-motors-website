import { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";
import { Car } from "@/components/CarCard";

interface StockListItem {
  id: number;
  title: string;
  price: number;
  // DB stores year as text; normalize to number in convertToCar
  year: string | number;
  miles_driven: string | null;
  description: string | null;
  attributes: string[] | null;
  is_available: boolean;
  image_url: string[] | null;
  created_at: string;
}

const convertToCar = (item: StockListItem, isSold = false): Car => ({
  id: item.id,
  title: item.title,
  make: "Mercedes-Benz", // default
  model: item.title.split(" ").slice(-1)[0] || "Unknown",
  year: Number(item.year),
  price: Number(item.price),
  description: item.description || "",
  imageUrl: item.image_url || [],
  mileage: parseInt((item.miles_driven || "0").replace(/,/g, "")) || 0,
  features: item.attributes || [],
  isSold,
});

export const useStockList = () => {
  const [stockItems, setStockItems] = useState<Car[]>([]);
  const [soldCars, setSoldCars] = useState<Car[]>([]);
  const [stockLoading, setStockLoading] = useState(true);
  const [stockError, setStockError] = useState<string | null>(null);
  const [soldLoading, setSoldLoading] = useState(true);
  const [soldError, setSoldError] = useState<string | null>(null);

  const fetchStockList = async () => {
    try {
      setStockLoading(true);
      setStockError(null);

      const { data: stock_list, error } = await supabase
        .from("stock_list")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStockItems((stock_list || []).map((item) => convertToCar(item, false)));
    } catch (err) {
      console.error("Error fetching stock list:", err);
      setStockError(
        err instanceof Error ? err.message : "Failed to load inventory"
      );
    } finally {
      setStockLoading(false);
    }
  };

  const fetchSoldCars = async () => {
    try {
      setSoldLoading(true);
      setSoldError(null);

      const { data: stock_list, error } = await supabase
        .from("stock_list")
        .select("*")
        .eq("is_available", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSoldCars((stock_list || []).map((item) => convertToCar(item, true)));
    } catch (err) {
      console.error("Error fetching sold cars:", err);
      setSoldError(
        err instanceof Error ? err.message : "Failed to load sold cars"
      );
    } finally {
      setSoldLoading(false);
    }
  };

  useEffect(() => {
    fetchStockList();
    fetchSoldCars();
  }, []);

  return {
    stockItems,
    soldCars,
    // Shared aliases for convenience/backwards-compatibility
    loading: stockLoading,
    error: stockError,
    soldLoading,
    soldError,
    refetchStock: fetchStockList,
    refetchSold: fetchSoldCars,
  };
};
