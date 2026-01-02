import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-tailor.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Elegant tailoring workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container-narrow mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-4 animate-fade-in">
            Bespoke Tailoring
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-slide-up">
            Crafting Elegance,
            <span className="block text-primary">One Stitch at a Time</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience personalized tailoring from the comfort of your home. 
            From consultations to fittings, every piece is crafted with care and precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              className="btn-primary rounded-full px-8 py-6 text-base font-medium gap-2 group"
              size="lg"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              className="btn-outline-gold rounded-full px-8 py-6 text-base font-medium"
              size="lg"
              onClick={() => document.getElementById('order-tracking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Track Your Order
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <span className="block font-display text-2xl font-semibold text-foreground">500+</span>
              <span className="font-body text-sm text-muted-foreground">Happy Clients</span>
            </div>
            <div className="text-center">
              <span className="block font-display text-2xl font-semibold text-foreground">10+</span>
              <span className="font-body text-sm text-muted-foreground">Years Experience</span>
            </div>
            <div className="text-center">
              <span className="block font-display text-2xl font-semibold text-foreground">100%</span>
              <span className="font-body text-sm text-muted-foreground">Custom Made</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
