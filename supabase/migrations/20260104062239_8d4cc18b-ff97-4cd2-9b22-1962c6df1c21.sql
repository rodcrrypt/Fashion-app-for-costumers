-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'in_progress', 'ready', 'completed', 'cancelled');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  estimated_completion DATE,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order updates table for status history and progress notes
CREATE TABLE public.order_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  note TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_updates ENABLE ROW LEVEL SECURITY;

-- Orders policies: Customers can only view their own orders
CREATE POLICY "Customers can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = customer_id);

-- Admins can do everything with orders
CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Order updates policies: Customers can view updates for their orders
CREATE POLICY "Customers can view own order updates"
ON public.order_updates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_updates.order_id
    AND orders.customer_id = auth.uid()
  )
);

-- Admins can manage all order updates
CREATE POLICY "Admins can manage all order updates"
ON public.order_updates FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating timestamps
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders and order_updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_updates;