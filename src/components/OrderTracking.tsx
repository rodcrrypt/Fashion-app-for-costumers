import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Camera, Package, CalendarDays, AlertCircle, ArrowRight, Eye } from 'lucide-react';
import { useOrders, useOrderUpdates, Order, OrderStatus } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const statusSteps: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Order Received' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'ready', label: 'Ready for Pickup' },
  { status: 'completed', label: 'Completed' },
];

const getStatusIndex = (status: OrderStatus): number => {
  if (status === 'cancelled') return -1;
  return statusSteps.findIndex(s => s.status === status);
};

const getStatusBadgeColor = (status: OrderStatus): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
    case 'in_progress': return 'bg-accent/20 text-accent';
    case 'ready': return 'bg-green-500/20 text-green-700 dark:text-green-400';
    case 'completed': return 'bg-primary/20 text-primary';
    case 'cancelled': return 'bg-destructive/20 text-destructive';
    default: return 'bg-muted text-muted-foreground';
  }
};

const formatStatus = (status: OrderStatus): string => {
  return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const OrderTracking = () => {
  const { user } = useAuth();
  const { orders, loading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { updates } = useOrderUpdates(selectedOrder?.id || null);

  if (!user) {
    return (
      <section id="track" className="section-padding bg-secondary/30" aria-labelledby="track-heading-guest">
        <div className="container-narrow mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-body text-sm tracking-wide uppercase mb-4">
              <Package className="w-4 h-4" aria-hidden="true" />
              Customer Portal
            </span>
            <h2 id="track-heading-guest" className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              Track Your Order
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
              Stay updated on every step of your garment's creation. 
              Log in to view your orders and real-time progress.
            </p>
            
            <div className="card-glass max-w-md mx-auto p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                View Your Orders
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Login to see progress photos, status updates, and estimated completion dates.
              </p>
              <a href="/auth">
                <Button className="btn-primary rounded-full px-8 py-3 font-medium group focus-ring">
                  Login to Track Orders
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="track" className="section-padding bg-secondary/30" aria-labelledby="track-heading">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-body text-sm tracking-wide uppercase mb-4">
            <Package className="w-4 h-4" aria-hidden="true" />
            Customer Portal
          </span>
          <h2 id="track-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Track Your Order
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
            Stay updated on every step of your garment's creation.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12" role="status" aria-label="Loading orders">
            <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground font-body">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 card-elegant max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
            <p className="font-body text-muted-foreground mb-6">
              You don't have any orders yet. Book an appointment to get started!
            </p>
            <Button 
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary rounded-full focus-ring"
            >
              Book Appointment
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-1">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
                  {orders.length}
                </span>
                Your Orders
              </h3>
              <div className="space-y-3" role="listbox" aria-label="Select an order to view details">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 focus-ring ${
                      selectedOrder?.id === order.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
                    }`}
                    role="option"
                    aria-selected={selectedOrder?.id === order.id}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-body font-semibold text-foreground line-clamp-1">{order.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>Created {format(new Date(order.created_at), 'MMM d, yyyy')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="space-y-6" role="region" aria-label={`Order details for ${selectedOrder.title}`}>
                  {/* Order Header */}
                  <div className="card-elegant p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                          {selectedOrder.title}
                        </h3>
                        {selectedOrder.description && (
                          <p className="font-body text-sm text-muted-foreground mt-2">
                            {selectedOrder.description}
                          </p>
                        )}
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedOrder.status)}`}>
                        {formatStatus(selectedOrder.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      {selectedOrder.estimated_completion && (
                        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg">
                          <CalendarDays className="w-4 h-4 text-primary" aria-hidden="true" />
                          <span>Est. completion: <strong className="text-foreground">{format(new Date(selectedOrder.estimated_completion), 'MMM d, yyyy')}</strong></span>
                        </div>
                      )}
                      {selectedOrder.total_amount && (
                        <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
                          <span className="font-semibold text-accent">₦{selectedOrder.total_amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {selectedOrder.status !== 'cancelled' && (
                    <div className="card-elegant p-6">
                      <h4 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
                        </div>
                        Progress
                      </h4>
                      <div className="flex justify-between items-center relative" role="progressbar" aria-valuenow={getStatusIndex(selectedOrder.status) + 1} aria-valuemin={0} aria-valuemax={4}>
                        {/* Progress Line Background */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full" aria-hidden="true" />
                        
                        {/* Active Progress Line */}
                        <div 
                          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" 
                          style={{ width: `${(getStatusIndex(selectedOrder.status) / (statusSteps.length - 1)) * 100}%` }}
                          aria-hidden="true"
                        />
                        
                        {statusSteps.map((step, index) => {
                          const currentIndex = getStatusIndex(selectedOrder.status);
                          const isCompleted = index <= currentIndex;
                          const isCurrent = index === currentIndex;

                          return (
                            <div key={step.status} className="relative z-10 flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCompleted 
                                  ? isCurrent 
                                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30' 
                                    : 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                                ) : (
                                  <Circle className="w-5 h-5" aria-hidden="true" />
                                )}
                              </div>
                              <span className={`text-xs mt-3 text-center max-w-[80px] ${
                                isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === 'cancelled' && (
                    <div className="card-elegant p-6 border-destructive/30 bg-destructive/5" role="alert">
                      <div className="flex items-center gap-3 text-destructive">
                        <AlertCircle className="w-6 h-6" aria-hidden="true" />
                        <span className="font-medium">This order has been cancelled</span>
                      </div>
                    </div>
                  )}

                  {/* Updates */}
                  <div className="card-elegant p-6">
                    <h4 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-primary" aria-hidden="true" />
                      </div>
                      Latest Updates
                      {updates.length > 0 && (
                        <span className="ml-auto text-sm font-normal text-muted-foreground">
                          {updates.length} update{updates.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </h4>
                    
                    {updates.length === 0 ? (
                      <div className="text-center py-8 bg-secondary/30 rounded-xl">
                        <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
                        <p className="text-muted-foreground text-sm">No updates yet for this order.</p>
                        <p className="text-muted-foreground text-xs mt-1">Check back soon!</p>
                      </div>
                    ) : (
                      <div className="space-y-4" role="feed" aria-label="Order updates">
                        {updates.map((update, index) => (
                          <article 
                            key={update.id} 
                            className="p-4 bg-secondary/50 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                            aria-posinset={index + 1}
                            aria-setsize={updates.length}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(update.status)}`}>
                                {formatStatus(update.status)}
                              </span>
                              <time className="font-body text-xs text-muted-foreground" dateTime={update.created_at}>
                                {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
                              </time>
                            </div>
                            {update.note && (
                              <p className="font-body text-sm text-foreground leading-relaxed">{update.note}</p>
                            )}
                            {update.photo_url && (
                              <img 
                                src={update.photo_url} 
                                alt="Progress photo showing garment construction" 
                                className="mt-3 rounded-xl w-full max-h-56 object-cover border border-border/50"
                                loading="lazy"
                              />
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card-elegant p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Select an Order
                  </h3>
                  <p className="font-body text-muted-foreground">
                    Click on an order from the list to view details and progress.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderTracking;
