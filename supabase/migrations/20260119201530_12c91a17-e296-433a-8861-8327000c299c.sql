-- Drop existing RESTRICTIVE policies on bookings
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;

-- Recreate policies as PERMISSIVE (default) so they use OR logic
-- Admins can do everything with bookings
CREATE POLICY "Admins can manage all bookings" 
ON public.bookings 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone (including anonymous) can create bookings
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Customers can view their own bookings by email
CREATE POLICY "Customers can view own bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));