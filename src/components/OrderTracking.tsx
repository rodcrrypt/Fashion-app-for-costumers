import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Camera, Package, CalendarDays, AlertCircle } from 'lucide-react';
import { useOrders, useOrderUpdates, Order, OrderStatus } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

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
    case 'pending': return 'bg-yellow-500/20 text-yellow-700';
    case 'in_progress': return 'bg-accent/20 text-accent';
    case 'ready': return 'bg-green-500/20 text-green-700';
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
      <section id="track" className="section-padding bg-secondary/30">
        <div className="container-narrow mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-4">
              Customer Portal
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Track Your Order
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto mb-8">
              Stay updated on every step of your garment's creation. 
              Log in to view your orders and real-time progress.
            </p>
            <a href="/auth" className="inline-flex items-center gap-2 btn-primary rounded-full px-8 py-3 font-medium">
              Login to Track Orders
            </a>
          </div>
        </div>
      </section>
    );
  }

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
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 card-elegant max-w-md mx-auto">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">No Orders Yet</h3>
            <p className="font-body text-muted-foreground">
              You don't have any orders yet. Book an appointment to get started!
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Your Orders</h3>
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedOrder?.id === order.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-body font-semibold text-foreground">{order.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    Created {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </p>
                </button>
              ))}
            </div>

            {/* Order Details */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="card-elegant p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          {selectedOrder.title}
                        </h3>
                        {selectedOrder.description && (
                          <p className="font-body text-sm text-muted-foreground mt-1">
                            {selectedOrder.description}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedOrder.status)}`}>
                        {formatStatus(selectedOrder.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {selectedOrder.estimated_completion && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-primary" />
                          <span>Est. completion: {format(new Date(selectedOrder.estimated_completion), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {selectedOrder.total_amount && (
                        <div className="flex items-center gap-2">
                          <span>Total: ₦{selectedOrder.total_amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {selectedOrder.status !== 'cancelled' && (
                    <div className="card-elegant p-6">
                      <h4 className="font-display text-lg font-semibold text-foreground mb-6">Progress</h4>
                      <div className="flex justify-between items-center">
                        {statusSteps.map((step, index) => {
                          const currentIndex = getStatusIndex(selectedOrder.status);
                          const isCompleted = index <= currentIndex;
                          const isCurrent = index === currentIndex;

                          return (
                            <div key={step.status} className="flex-1 relative">
                              <div className="flex flex-col items-center">
                                {isCompleted ? (
                                  <CheckCircle2 className={`w-8 h-8 ${isCurrent ? 'text-accent' : 'text-primary'}`} />
                                ) : (
                                  <Circle className="w-8 h-8 text-muted" />
                                )}
                                <span className={`text-xs mt-2 text-center ${
                                  isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                              {index < statusSteps.length - 1 && (
                                <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === 'cancelled' && (
                    <div className="card-elegant p-6 border-destructive/30 bg-destructive/5">
                      <div className="flex items-center gap-3 text-destructive">
                        <AlertCircle className="w-6 h-6" />
                        <span className="font-medium">This order has been cancelled</span>
                      </div>
                    </div>
                  )}

                  {/* Updates */}
                  <div className="card-elegant p-6">
                    <h4 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-primary" />
                      Latest Updates
                    </h4>
                    
                    {updates.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No updates yet for this order.</p>
                    ) : (
                      <div className="space-y-4">
                        {updates.map((update) => (
                          <div key={update.id} className="p-4 bg-secondary/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(update.status)}`}>
                                {formatStatus(update.status)}
                              </span>
                              <span className="font-body text-xs text-muted-foreground">
                                {format(new Date(update.created_at), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                            {update.note && (
                              <p className="font-body text-sm text-foreground">{update.note}</p>
                            )}
                            {update.photo_url && (
                              <img 
                                src={update.photo_url} 
                                alt="Progress photo" 
                                className="mt-3 rounded-lg w-full max-h-48 object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card-elegant p-12 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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
