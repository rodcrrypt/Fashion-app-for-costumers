import { useState } from 'react';
import { Search, CheckCircle2, Circle, Clock, Camera, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const sampleOrder = {
  id: 'ORD-2024-0847',
  item: 'Custom Silk Blouse',
  customer: 'Sarah M.',
  status: 'in_progress',
  currentStep: 2,
  steps: [
    { id: 1, title: 'Order Received', date: 'Dec 28, 2025', completed: true },
    { id: 2, title: 'Measurements Confirmed', date: 'Dec 29, 2025', completed: true },
    { id: 3, title: 'Cutting in Progress', date: 'Dec 30, 2025', completed: false, current: true },
    { id: 4, title: 'Sewing', date: 'Expected Jan 2', completed: false },
    { id: 5, title: 'Final Fitting', date: 'Expected Jan 4', completed: false },
    { id: 6, title: 'Ready for Pickup', date: 'Expected Jan 5', completed: false },
  ],
  updates: [
    {
      date: 'Dec 30, 2025',
      message: 'Your fabric has been cut! Here\'s a sneak peek of the pattern layout.',
      hasImage: true,
    },
    {
      date: 'Dec 29, 2025',
      message: 'Measurements verified. Starting the cutting process tomorrow.',
      hasImage: false,
    },
  ],
};

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [showOrder, setShowOrder] = useState(true);

  return (
    <section id="track" className="section-padding bg-secondary/30">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-4">
            Customer Portal
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Track Your Order
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Stay updated on every step of your garment's creation. 
            Enter your order ID to view real-time progress and photos.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter Order ID (e.g., ORD-2024-0847)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="pl-10 rounded-full bg-background border-border"
              />
            </div>
            <Button 
              className="btn-primary rounded-full px-6"
              onClick={() => setShowOrder(true)}
            >
              Track
            </Button>
          </div>
        </div>

        {/* Order Details */}
        {showOrder && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Timeline */}
            <div className="lg:col-span-2 card-elegant p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {sampleOrder.item}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Order #{sampleOrder.id}
                  </p>
                </div>
                <span className="px-4 py-1 rounded-full bg-accent/20 text-accent font-body text-sm font-medium">
                  In Progress
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {sampleOrder.steps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : step.current ? (
                        <Clock className="w-6 h-6 text-accent animate-pulse" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted" />
                      )}
                      {index < sampleOrder.steps.length - 1 && (
                        <div className={`w-0.5 h-12 mt-2 ${
                          step.completed ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className={`font-body font-semibold ${
                        step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="font-body text-sm text-muted-foreground">
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Updates & Photos */}
            <div className="card-elegant p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Latest Updates
              </h3>
              
              <div className="space-y-4">
                {sampleOrder.updates.map((update, index) => (
                  <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                    <p className="font-body text-xs text-muted-foreground mb-2">
                      {update.date}
                    </p>
                    <p className="font-body text-sm text-foreground mb-3">
                      {update.message}
                    </p>
                    {update.hasImage && (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4 rounded-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderTracking;
