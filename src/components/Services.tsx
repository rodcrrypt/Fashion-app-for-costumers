import { Ruler, Scissors, Package, Shirt, SprayCan, Gem, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Ruler,
    title: 'Consultation',
    description: 'Discuss your vision, preferences, and get expert advice on fabrics and styles.',
    duration: '30 min',
    price: 'Free',
    highlight: true,
  },
  {
    icon: Scissors,
    title: 'Custom Tailoring',
    description: 'Bespoke garments crafted to your exact measurements and specifications.',
    duration: '2-3 weeks',
    price: 'From ₦25,000',
  },
  {
    icon: Shirt,
    title: 'Alterations',
    description: 'Perfect fit adjustments for your existing wardrobe pieces.',
    duration: '3-5 days',
    price: 'From ₦5,000',
  },
  {
    icon: SprayCan,
    title: 'Fitting Session',
    description: 'Try on your garment for final adjustments and perfect fit.',
    duration: '45 min',
    price: 'Included',
  },
  {
    icon: Gem,
    title: 'Bridal & Special',
    description: 'Wedding gowns, bridesmaids dresses, and special occasion wear.',
    duration: '4-6 weeks',
    price: 'Custom Quote',
    highlight: true,
  },
  {
    icon: Package,
    title: 'Pickup & Delivery',
    description: 'Convenient pickup of your completed garments.',
    duration: '15 min',
    price: 'Free',
  },
];

const Services = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="section-padding bg-secondary/30" aria-labelledby="services-heading">
      <div className="container-narrow mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-body text-sm tracking-wide uppercase mb-4">
            <Gem className="w-4 h-4" aria-hidden="true" />
            What We Offer
          </span>
          <h2 id="services-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Our Services
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
            From initial consultation to final fitting, we provide a complete tailoring experience 
            tailored to your unique style and needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Available services">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={`card-elegant p-6 group hover-lift ${
                service.highlight ? 'ring-2 ring-primary/20' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              role="listitem"
            >
              {service.highlight && (
                <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
              
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-xl bg-rose-light/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 flex-shrink-0"
                  aria-hidden="true"
                >
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body text-muted-foreground flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duration}
                    </span>
                    <span className="font-body font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {service.price}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button 
            onClick={scrollToBooking}
            className="btn-primary rounded-full px-8 py-6 text-base font-medium gap-2 group focus-ring"
            size="lg"
          >
            Book Your Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Free consultation • No obligation
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
