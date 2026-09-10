import { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";

// Define the type if not already defined elsewhere
interface HappyCustomer {
  id: string | number;
  image_url: string;
  created_at: string | null;
  updated_at?: string;
}

export const useHappyCustomers = () => {
  const [customers, setCustomers] = useState<HappyCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data: happyCustomers, error } = await supabase
        .from("happy_customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(happyCustomers || []);
    } catch (err) {
      console.error("Error fetching happy customers:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (imageUrl: string) => {
    try {
      const { data, error } = await supabase
        .from("happy_customers")
        .insert([{ image_url: imageUrl }])
        .select();

      if (error) throw error;
      await fetchCustomers();

      return { data, error: null };
    } catch (err) {
      console.error("Error adding customer:", err);
      return {
        data: null,
        error: err instanceof Error ? err.message : "Failed to add customer",
      };
    }
  };

  const deleteCustomer = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from("happy_customers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchCustomers();

      return { error: null };
    } catch (err) {
      console.error("Error deleting customer:", err);
      return {
        error: err instanceof Error ? err.message : "Failed to delete customer",
      };
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    addCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
  };
};
