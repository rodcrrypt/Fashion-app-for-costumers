import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import BookingSection from '@/components/BookingSection';
import OrderTracking from '@/components/OrderTracking';
import AdminOrderManagement from '@/components/AdminOrderManagement';
import AdminMeasurements from '@/components/AdminMeasurements';
import CustomerMeasurements from '@/components/CustomerMeasurements';
import SetupGuide from '@/components/SetupGuide';
import Footer from '@/components/Footer';
import CustomerSupportButton from '@/components/CustomerSupportButton';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAdmin, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <BookingSection />
        {isAdmin && (
          <section id="admin-measurements" className="section-padding bg-muted/30">
            <div className="container-narrow mx-auto">
              <AdminMeasurements />
            </div>
          </section>
        )}
        {isAdmin && <AdminOrderManagement />}
        {user && !isAdmin && <CustomerMeasurements />}
        <OrderTracking />
        <SetupGuide />
      </main>
      <Footer />
      <CustomerSupportButton />
    </div>
  );
};

export default Index;
