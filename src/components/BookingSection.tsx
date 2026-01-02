import { Calendar, Clock, MessageCircle, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Calendar,
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

const BookingSection = () => {
  return (
    <section id="booking" className="section-padding">
      <div className="container-narrow mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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

          {/* Right - Booking Widget Placeholder */}
          <div className="card-elegant p-6 md:p-8">
            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Book Your Appointment
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                Select a service and choose your preferred time
              </p>
            </div>

            {/* Service Selection */}
            <div className="space-y-3 mb-6">
              {['Consultation (Free, 30 min)', 'Fitting Session (45 min)', 'Pickup (15 min)'].map((service) => (
                <label
                  key={service}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="service"
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="font-body text-sm text-foreground">{service}</span>
                </label>
              ))}
            </div>

            {/* Calendly Embed Placeholder */}
            <div className="bg-secondary/50 rounded-lg p-8 text-center border-2 border-dashed border-border mb-6">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-body text-sm text-muted-foreground mb-4">
                Calendly widget will appear here
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {"<!-- Calendly embed code -->"}
              </code>
            </div>

            <Button className="btn-primary w-full rounded-full">
              View Available Times
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
