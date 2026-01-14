import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Sparkles, Star } from 'lucide-react';
import heroImage from '@/assets/hero-tailor.jpg';

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20" aria-labelledby="hero-heading">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-32 right-20 hidden lg:block animate-float" aria-hidden="true">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />
      </div>
      <div className="absolute bottom-40 right-40 hidden lg:block animate-float" style={{ animationDelay: '2s' }} aria-hidden="true">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/15 to-primary/15 blur-2xl" />
      </div>

      {/* Content */}
      <div className="container-narrow mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="font-body text-sm tracking-wide text-muted-foreground">
              Bespoke Tailoring Excellence
            </span>
          </div>

          <h1 
            id="hero-heading"
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-tight mb-6 animate-slide-up"
          >
            <span className="text-gradient-rose">Beauty in its</span>
            <br />
            <span className="text-foreground">Entirety</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground mb-8 max-w-lg animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Experience personalized tailoring from the comfort of your home. 
            Every piece is crafted with care, precision, and passion.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              className="btn-primary rounded-full px-8 py-6 text-base font-medium gap-2 group focus-ring"
              size="lg"
              onClick={() => scrollToSection('booking')}
              aria-describedby="book-desc"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              Book Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
            <span id="book-desc" className="sr-only">Schedule your tailoring consultation</span>
            
            <Button 
              variant="outline"
              className="btn-outline-gold rounded-full px-8 py-6 text-base font-medium focus-ring"
              size="lg"
              onClick={() => scrollToSection('track')}
              aria-describedby="track-desc"
            >
              Track Your Order
            </Button>
            <span id="track-desc" className="sr-only">View the status of your existing orders</span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center group" role="figure" aria-label="500+ Happy Clients">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-accent fill-accent" aria-hidden="true" />
                <span className="font-display text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">500+</span>
              </div>
              <span className="font-body text-sm text-muted-foreground">Happy Clients</span>
            </div>
            <div className="text-center group" role="figure" aria-label="10+ Years Experience">
              <span className="block font-display text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">10+</span>
              <span className="font-body text-sm text-muted-foreground">Years Experience</span>
            </div>
            <div className="text-center group" role="figure" aria-label="100% Custom Made">
              <span className="block font-display text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">100%</span>
              <span className="font-body text-sm text-muted-foreground">Custom Made</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft hidden md:block" aria-hidden="true">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
