import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminBookings from '@/components/AdminBookings';
import AdminMeasurements from '@/components/AdminMeasurements';
import AdminOrderManagement from '@/components/AdminOrderManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Ruler, Package, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        <div className="container-narrow mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="inline-block font-body text-sm tracking-widest text-accent uppercase">
                  Admin Panel
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                  Dashboard
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              Manage all your bookings, customer measurements, and orders in one place.
            </p>
          </div>

          {/* Tabs Navigation */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger 
                value="bookings" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Bookings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="measurements" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <Ruler className="w-4 h-4" />
                <span className="hidden sm:inline">Measurements</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="mt-0">
              <AdminBookingsContent />
            </TabsContent>

            <TabsContent value="measurements" className="mt-0">
              <AdminMeasurementsContent />
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <AdminOrdersContent />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Wrapper components to render admin sections without their section wrappers
const AdminBookingsContent = () => {
  return (
    <div className="bg-background">
      <AdminBookings />
    </div>
  );
};

const AdminMeasurementsContent = () => {
  return (
    <div className="bg-background">
      <AdminMeasurements />
    </div>
  );
};

const AdminOrdersContent = () => {
  return (
    <div className="bg-background">
      <AdminOrderManagement />
    </div>
  );
};

export default AdminDashboard;
