-- Drop existing policies for orders
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;

-- Recreate as PERMISSIVE policies for orders
CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Customers can view own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);

-- Drop existing policies for bookings
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;

-- Recreate as PERMISSIVE policies for bookings
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Customers can view own bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));