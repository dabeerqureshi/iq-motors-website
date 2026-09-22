import { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";
import { Car } from "@/components/CarCard";
import { toCar } from "@/lib/stock";

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

      setStockItems((stock_list || []).map((item) => toCar(item, false)));
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

      setSoldCars((stock_list || []).map((item) => toCar(item, true)));
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
