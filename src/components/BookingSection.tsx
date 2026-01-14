import { Clock, MessageCircle, CreditCard, ExternalLink, CheckCircle, Calendar } from 'lucide-react';
import { InlineWidget } from 'react-calendly';

const features = [
  {
    icon: Clock,
    title: 'Easy Scheduling',
    description: 'Pick your preferred date and time slot',
  },
  {
    icon: Calendar,
    title: 'SMS Reminders',
    description: 'Get automatic reminders before your appointment',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Updates',
    description: 'Receive updates directly on WhatsApp',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay deposits or full amounts online',
  },
];

const steps = [
  { number: '01', title: 'Book', description: 'Choose your date' },
  { number: '02', title: 'Consult', description: 'Discuss your style' },
  { number: '03', title: 'Measure', description: 'Perfect fitting' },
  { number: '04', title: 'Receive', description: 'Get your garment' },
];

const CALENDLY_URL = 'https://calendly.com/dressbyorekelewa/consultation';

const BookingSection = () => {
  return (
    <section id="booking" className="section-padding" aria-labelledby="booking-heading">
      <div className="container-narrow mx-auto">
        {/* Process Steps */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center group">
                <div className="relative inline-block mb-3">
                  <span className="font-display text-4xl md:text-5xl font-semibold text-gradient-gold">
                    {step.number}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent" aria-hidden="true" />
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-body text-sm tracking-wide uppercase mb-4">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Book Online
            </span>
            <h2 id="booking-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              Schedule Your<br />
              <span className="text-gradient-rose">Appointment</span>
            </h2>
            <p className="font-body text-muted-foreground mb-8 text-lg leading-relaxed">
              Book consultations, fittings, or pickups at your convenience. 
              Select your service type and preferred time slot below.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" role="list" aria-label="Booking features">
              {features.map((feature) => (
                <div 
                  key={feature.title} 
                  className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                  role="listitem"
                >
                  <div className="p-2 rounded-lg bg-rose-light/30 text-primary flex-shrink-0" aria-hidden="true">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-foreground text-sm">
                      {feature.title}
                    </h4>
                    <p className="font-body text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="p-4 bg-card-glass rounded-xl border border-border/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent/10 text-accent flex-shrink-0" aria-hidden="true">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                    Powered by Calendly
                    <CheckCircle className="w-4 h-4 text-green-500" aria-label="Verified" />
                  </h4>
                  <p className="font-body text-sm text-muted-foreground">
                    We use Calendly for seamless appointment booking. It's free, secure, 
                    and integrates with SMS & WhatsApp reminders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Calendly Widget */}
          <div className="card-elegant overflow-hidden" role="region" aria-label="Appointment booking calendar">
            <InlineWidget
              url={CALENDLY_URL}
              styles={{
                height: '650px',
                minWidth: '320px',
              }}
              pageSettings={{
                backgroundColor: 'ffffff',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: 'c9a45c',
                textColor: '1a1a1a',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
