import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import BookingSection from '@/components/BookingSection';
import OrderTracking from '@/components/OrderTracking';
import AdminOrderManagement from '@/components/AdminOrderManagement';
import SetupGuide from '@/components/SetupGuide';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <BookingSection />
        {isAdmin && <AdminOrderManagement />}
        <OrderTracking />
        <SetupGuide />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
