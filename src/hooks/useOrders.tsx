import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customer_id: string;
  title: string;
  description: string | null;
  status: OrderStatus;
  estimated_completion: string | null;
  total_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface OrderUpdate {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  photo_url: string | null;
  created_at: string;
}

export const useOrders = () => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { orders, loading, error, refetch: fetchOrders };
};

export const useOrderUpdates = (orderId: string | null) => {
  const [updates, setUpdates] = useState<OrderUpdate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUpdates = async () => {
    if (!orderId) {
      setUpdates([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('order_updates')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();

    if (!orderId) return;

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-updates-${orderId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'order_updates',
          filter: `order_id=eq.${orderId}`
        },
        () => {
          fetchUpdates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { updates, loading, refetch: fetchUpdates };
};
