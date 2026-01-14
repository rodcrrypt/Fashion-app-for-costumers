-- Fix security: Add base permissive policies requiring authentication
-- This ensures unauthenticated users cannot access any data

-- PROFILES TABLE
-- Drop existing restrictive policies and recreate as permissive with proper auth checks
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create permissive policies with explicit authentication requirement
CREATE POLICY "Authenticated users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- MEASUREMENTS TABLE
DROP POLICY IF EXISTS "Admins can manage all measurements" ON public.measurements;
DROP POLICY IF EXISTS "Customers can view own measurements" ON public.measurements;

CREATE POLICY "Admins can manage all measurements"
ON public.measurements FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Customers can view own measurements"
ON public.measurements FOR SELECT
TO authenticated
USING (auth.uid() = customer_id);

-- ORDERS TABLE
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;

CREATE POLICY "Admins can manage all orders"
ON public.orders FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Customers can view own orders"
ON public.orders FOR SELECT
TO authenticated
USING (auth.uid() = customer_id);

-- ORDER_UPDATES TABLE
DROP POLICY IF EXISTS "Admins can manage all order updates" ON public.order_updates;
DROP POLICY IF EXISTS "Customers can view own order updates" ON public.order_updates;

CREATE POLICY "Admins can manage all order updates"
ON public.order_updates FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Customers can view own order updates"
ON public.order_updates FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_updates.order_id
  AND orders.customer_id = auth.uid()
));

-- USER_ROLES TABLE
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));