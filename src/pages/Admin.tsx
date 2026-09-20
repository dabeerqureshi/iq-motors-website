import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import AdminStockManagement from "@/components/admin/AdminStockManagement";
import AdminHappyCustomersManagement from "@/components/admin/AdminHappyCustomersManagement";

import AdminAuth from "@/components/admin/AdminAuth";
import {
  Car,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Package,
  Heart,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const { isAdmin, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminAuth />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        <div className="bg-cardealer-primary text-white py-8">
          <div className="container mx-auto px-4">
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-lg sm:text-xl opacity-90">
                  Manage your dealership operations
                </p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="bg-white text-cardealer-primary hover:bg-gray-100 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stock" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Stock List
              </TabsTrigger>

              <TabsTrigger
                value="happy-customers"
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Happy Customers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stock" className="mt-6">
              <AdminStockManagement />
            </TabsContent>

            <TabsContent value="happy-customers" className="mt-6">
              <AdminHappyCustomersManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
