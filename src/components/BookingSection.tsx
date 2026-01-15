import { useState } from 'react';
import { Clock, MessageCircle, CreditCard, CheckCircle, Calendar, User, Phone, Mail, Sparkles } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

const serviceTypes = [
  { value: 'consultation', label: 'Initial Consultation' },
  { value: 'fitting', label: 'Fitting Session' },
  { value: 'pickup', label: 'Order Pickup' },
  { value: 'alterations', label: 'Alterations' },
];

const BookingSection = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStep, setBookingStep] = useState<'date' | 'details' | 'confirm'>('date');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !serviceType || !formData.name || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save booking to database
      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user?.id || null,
          customer_name: formData.name,
          customer_email: formData.email || '',
          customer_phone: formData.phone,
          service_type: serviceType,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          booking_time: selectedTime,
          notes: formData.notes || null,
          status: 'pending',
        });

      if (error) throw error;
      
      toast({
        title: "Booking Confirmed! 🎉",
        description: `Your ${serviceTypes.find(s => s.value === serviceType)?.label} is scheduled for ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime}. We'll send you a confirmation via WhatsApp.`,
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setServiceType('');
      setFormData({ name: '', email: '', phone: '', notes: '' });
      setBookingStep('date');
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToDetails = selectedDate && selectedTime && serviceType;

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
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                    Direct Booking
                    <CheckCircle className="w-4 h-4 text-green-500" aria-label="Verified" />
                  </h4>
                  <p className="font-body text-sm text-muted-foreground">
                    Book directly with us for personalized service. 
                    We'll confirm via WhatsApp within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Custom Booking Form */}
          <div className="card-elegant overflow-hidden p-6" role="region" aria-label="Appointment booking form">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setBookingStep('date')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    bookingStep === 'date' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Date & Time
                </button>
                <div className="w-8 h-0.5 bg-border" />
                <button
                  type="button"
                  onClick={() => canProceedToDetails && setBookingStep('details')}
                  disabled={!canProceedToDetails}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    bookingStep === 'details' 
                      ? 'bg-primary text-primary-foreground' 
                      : canProceedToDetails 
                        ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
                        : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Your Details
                </button>
              </div>

              {bookingStep === 'date' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label htmlFor="service-type" className="text-sm font-medium">
                      Service Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger id="service-type" className="w-full">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Calendar */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Select Date <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex justify-center border rounded-lg p-3 bg-background">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => isBefore(date, startOfToday()) || date > addDays(new Date(), 60)}
                        className="rounded-md"
                      />
                    </div>
                    {selectedDate && (
                      <p className="text-sm text-primary font-medium text-center">
                        Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </p>
                    )}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Select Time <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            selectedTime === time
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setBookingStep('details')}
                    disabled={!canProceedToDetails}
                    className="w-full"
                    size="lg"
                  >
                    Continue to Details
                  </Button>
                </div>
              )}

              {bookingStep === 'details' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Summary */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-medium text-sm mb-2">Booking Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Service:</strong> {serviceTypes.find(s => s.value === serviceType)?.label}</p>
                      <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone/WhatsApp <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234 XXX XXX XXXX"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email (optional)
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Additional Notes (optional)
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any specific requirements or style preferences..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setBookingStep('date')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !formData.phone}
                      className="flex-1"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
