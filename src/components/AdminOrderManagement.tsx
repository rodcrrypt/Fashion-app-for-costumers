import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrders, useOrderUpdates, Order, OrderStatus } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, MessageSquare, Users, Package, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface CustomerProfile {
  id: string;
  full_name: string | null;
  email: string | null;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'ready', label: 'Ready for Pickup' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

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

const AdminOrderManagement = () => {
  const { user, isAdmin } = useAuth();
  const { orders, loading, refetch } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { updates, refetch: refetchUpdates } = useOrderUpdates(selectedOrder?.id || null);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customer_id: '',
    title: '',
    description: '',
    estimated_completion: '',
    total_amount: '',
  });

  // Status update form state
  const [statusUpdate, setStatusUpdate] = useState({
    status: '' as OrderStatus,
    note: '',
    photo_url: '',
  });

  const fetchCustomers = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, email');
    if (data) setCustomers(data);
  };

  const handleCreateOrder = async () => {
    try {
      const { error } = await supabase.from('orders').insert({
        customer_id: newOrder.customer_id,
        title: newOrder.title,
        description: newOrder.description || null,
        estimated_completion: newOrder.estimated_completion || null,
        total_amount: newOrder.total_amount ? parseFloat(newOrder.total_amount) : null,
      });

      if (error) throw error;

      toast.success('Order created successfully');
      setShowNewOrderDialog(false);
      setNewOrder({ customer_id: '', title: '', description: '', estimated_completion: '', total_amount: '' });
      refetch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create order');
    }
  };

  const handleAddUpdate = async () => {
    if (!selectedOrder) return;

    try {
      // Add the update
      const { error: updateError } = await supabase.from('order_updates').insert({
        order_id: selectedOrder.id,
        status: statusUpdate.status,
        note: statusUpdate.note || null,
        photo_url: statusUpdate.photo_url || null,
      });

      if (updateError) throw updateError;

      // Update the order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: statusUpdate.status })
        .eq('id', selectedOrder.id);

      if (orderError) throw orderError;

      toast.success('Status updated successfully');
      setShowUpdateDialog(false);
      setStatusUpdate({ status: '' as OrderStatus, note: '', photo_url: '' });
      refetch();
      refetchUpdates();
      
      // Update selected order status locally
      setSelectedOrder({ ...selectedOrder, status: statusUpdate.status });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  return (
    <section id="admin-orders" className="section-padding bg-background">
      <div className="container-narrow mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-block font-body text-sm tracking-widest text-accent uppercase mb-2">
              Admin Dashboard
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground">
              Order Management
            </h2>
          </div>
          <Dialog open={showNewOrderDialog} onOpenChange={(open) => {
            setShowNewOrderDialog(open);
            if (open) fetchCustomers();
          }}>
            <DialogTrigger asChild>
              <Button className="btn-primary rounded-full gap-2">
                <Plus className="w-4 h-4" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Customer</label>
                  <Select value={newOrder.customer_id} onValueChange={(v) => setNewOrder({ ...newOrder, customer_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.full_name || c.email || 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Title</label>
                  <Input
                    value={newOrder.title}
                    onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
                    placeholder="e.g., Custom Silk Blouse"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Textarea
                    value={newOrder.description}
                    onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                    placeholder="Order details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Est. Completion</label>
                    <Input
                      type="date"
                      value={newOrder.estimated_completion}
                      onChange={(e) => setNewOrder({ ...newOrder, estimated_completion: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Total Amount (₦)</label>
                    <Input
                      type="number"
                      value={newOrder.total_amount}
                      onChange={(e) => setNewOrder({ ...newOrder, total_amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <Button onClick={handleCreateOrder} className="w-full btn-primary" disabled={!newOrder.customer_id || !newOrder.title}>
                  Create Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-elegant p-4 text-center">
            <Package className="w-6 h-6 text-primary mx-auto mb-2" />
            <span className="block font-display text-2xl font-semibold">{orderStats.total}</span>
            <span className="text-sm text-muted-foreground">Total Orders</span>
          </div>
          <div className="card-elegant p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <span className="block font-display text-2xl font-semibold">{orderStats.pending}</span>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="card-elegant p-4 text-center">
            <Edit2 className="w-6 h-6 text-accent mx-auto mb-2" />
            <span className="block font-display text-2xl font-semibold">{orderStats.inProgress}</span>
            <span className="text-sm text-muted-foreground">In Progress</span>
          </div>
          <div className="card-elegant p-4 text-center">
            <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <span className="block font-display text-2xl font-semibold">{orderStats.ready}</span>
            <span className="text-sm text-muted-foreground">Ready</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 card-elegant">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground">Create your first order to get started.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold">All Orders</h3>
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
                    <h4 className="font-semibold text-foreground">{order.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </p>
                </button>
              ))}
            </div>

            {/* Order Details & Updates */}
            <div>
              {selectedOrder ? (
                <div className="card-elegant p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{selectedOrder.title}</h3>
                      {selectedOrder.description && (
                        <p className="text-sm text-muted-foreground mt-1">{selectedOrder.description}</p>
                      )}
                    </div>
                    <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Add Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Status Update</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">New Status</label>
                            <Select value={statusUpdate.status} onValueChange={(v) => setStatusUpdate({ ...statusUpdate, status: v as OrderStatus })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Note (optional)</label>
                            <Textarea
                              value={statusUpdate.note}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, note: e.target.value })}
                              placeholder="Update message for customer..."
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Photo URL (optional)</label>
                            <Input
                              value={statusUpdate.photo_url}
                              onChange={(e) => setStatusUpdate({ ...statusUpdate, photo_url: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <Button onClick={handleAddUpdate} className="w-full btn-primary" disabled={!statusUpdate.status}>
                            Save Update
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="text-sm space-y-1 text-muted-foreground">
                    {selectedOrder.estimated_completion && (
                      <p>Est. completion: {format(new Date(selectedOrder.estimated_completion), 'MMM d, yyyy')}</p>
                    )}
                    {selectedOrder.total_amount && <p>Total: ₦{selectedOrder.total_amount.toLocaleString()}</p>}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Update History</h4>
                    {updates.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No updates yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {updates.map((update) => (
                          <div key={update.id} className="p-3 bg-secondary/50 rounded-lg text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeColor(update.status)}`}>
                                {update.status.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(update.created_at), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            {update.note && <p className="text-foreground">{update.note}</p>}
                            {update.photo_url && (
                              <img src={update.photo_url} alt="Progress" className="mt-2 rounded max-h-32 object-cover" />
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
                  <p className="text-muted-foreground">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminOrderManagement;
