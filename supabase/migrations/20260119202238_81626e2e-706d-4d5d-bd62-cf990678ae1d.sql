-- Create a security definer function to get current user's email
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid()
$$;

-- Drop and recreate the customers policy using the function
DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;

CREATE POLICY "Customers can view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (customer_email = public.get_current_user_email());