import { Ruler, Scissors, Package, Shirt, SprayCan, Gem } from 'lucide-react';

const services = [
  {
    icon: Ruler,
    title: 'Consultation',
    description: 'Discuss your vision, preferences, and get expert advice on fabrics and styles.',
    duration: '30 min',
    price: 'Free',
  },
  {
    icon: Scissors,
    title: 'Custom Tailoring',
    description: 'Bespoke garments crafted to your exact measurements and specifications.',
    duration: '2-3 weeks',
    price: 'From $150',
  },
  {
    icon: Shirt,
    title: 'Alterations',
    description: 'Perfect fit adjustments for your existing wardrobe pieces.',
    duration: '3-5 days',
    price: 'From $25',
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
  return (
    <section id="services" className="section-padding bg-secondary/30">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-4">
            What We Offer
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Our Services
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            From initial consultation to final fitting, we provide a complete tailoring experience 
            tailored to your unique style and needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="card-elegant p-6 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-rose-light/30 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body text-muted-foreground">
                      {service.duration}
                    </span>
                    <span className="font-body font-semibold text-accent">
                      {service.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
