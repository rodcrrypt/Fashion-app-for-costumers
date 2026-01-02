import { CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const calendlyEmbedCode = `<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" 
  data-url="https://calendly.com/YOUR-USERNAME" 
  style="min-width:320px;height:700px;">
</div>
<script type="text/javascript" 
  src="https://assets.calendly.com/assets/external/widget.js" 
  async>
</script>
<!-- Calendly inline widget end -->`;

const steps = [
  {
    title: 'Create a Free Calendly Account',
    description: 'Sign up at calendly.com with your email. The free tier includes 1 event type, which is perfect to start.',
    link: 'https://calendly.com',
  },
  {
    title: 'Set Up Your Event Types',
    description: 'Create events for: Consultation (30 min), Fitting Session (45 min), and Pickup (15 min). Set your availability for each.',
  },
  {
    title: 'Enable SMS/WhatsApp Reminders',
    description: 'Go to Event Settings → Notifications → Add SMS reminder. For WhatsApp, use Calendly\'s integration or connect Twilio.',
  },
  {
    title: 'Connect to Stripe for Payments',
    description: 'In Calendly → Integrations → Payments, connect Stripe to collect deposits or full payments at booking.',
  },
  {
    title: 'Get Your Embed Code',
    description: 'Go to Share → Embed → Inline Widget. Copy the code and paste it into your booking section.',
  },
];

const SetupGuide = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(calendlyEmbedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="setup" className="section-padding">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-4">
            Setup Guide
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            How to Set Up Online Booking
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Follow these steps to enable appointment booking with SMS/WhatsApp reminders and payment collection.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="font-body text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-1">
                    {step.title}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-body text-sm text-primary hover:underline"
                    >
                      Visit Calendly <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Embed Code */}
          <div>
            <div className="card-elegant p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Sample Embed Code
              </h3>
              <div className="relative">
                <pre className="bg-charcoal text-cream p-4 rounded-lg text-xs overflow-x-auto font-mono">
                  {calendlyEmbedCode}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 gap-2"
                  onClick={handleCopy}
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-4">
                Replace <code className="bg-muted px-1 rounded">YOUR-USERNAME</code> with your Calendly username.
              </p>
            </div>

            {/* Alternative Tools */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
              <h4 className="font-display text-base font-semibold text-foreground mb-3">
                Alternative Booking Tools (2026)
              </h4>
              <ul className="space-y-2 font-body text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <strong>Calendly</strong> — Best free option, Stripe integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <strong>Acuity Scheduling</strong> — Great for service businesses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <strong>Cal.com</strong> — Free, open-source alternative
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <strong>Tidycal</strong> — One-time payment option
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetupGuide;
