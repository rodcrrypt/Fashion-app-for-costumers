import { Clock, MessageCircle, CreditCard, ExternalLink } from 'lucide-react';
import { InlineWidget } from 'react-calendly';

const features = [
  {
    icon: Clock,
    title: 'Easy Scheduling',
    description: 'Pick your preferred date and time slot',
  },
  {
    icon: Clock,
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

const CALENDLY_URL = 'https://calendly.com/dressbyorekelewa/consultation';

const BookingSection = () => {
  return (
    <section id="booking" className="section-padding">
      <div className="container-narrow mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-4">
              Book Online
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Schedule Your Appointment
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Book consultations, fittings, or pickups at your convenience. 
              Select your service type and preferred time slot below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-light/30 text-primary">
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

            <div className="p-4 bg-secondary/50 rounded-lg border border-border">
              <h4 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-accent" />
                Powered by Calendly
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                We use Calendly for seamless appointment booking. It's free, secure, 
                and integrates with SMS & WhatsApp reminders.
              </p>
            </div>
          </div>

          {/* Right - Calendly Widget */}
          <div className="card-elegant overflow-hidden">
            <InlineWidget
              url={CALENDLY_URL}
              styles={{
                height: '630px',
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
