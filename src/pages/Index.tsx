import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import BookingSection from '@/components/BookingSection';
import OrderTracking from '@/components/OrderTracking';
import SetupGuide from '@/components/SetupGuide';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Services />
        <BookingSection />
        <OrderTracking />
        <SetupGuide />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
