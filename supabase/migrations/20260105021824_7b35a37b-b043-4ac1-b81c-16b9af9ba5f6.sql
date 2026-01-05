-- Create measurements table for storing client body measurements
CREATE TABLE public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  
  -- Upper body measurements (in cm)
  chest NUMERIC,
  shoulder NUMERIC,
  arm_length NUMERIC,
  bicep NUMERIC,
  wrist NUMERIC,
  neck NUMERIC,
  
  -- Lower body measurements (in cm)
  waist NUMERIC,
  hip NUMERIC,
  inseam NUMERIC,
  outseam NUMERIC,
  thigh NUMERIC,
  
  -- Full body
  height NUMERIC,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage all measurements"
ON public.measurements
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for customer to view own measurements
CREATE POLICY "Customers can view own measurements"
ON public.measurements
FOR SELECT
USING (auth.uid() = customer_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_measurements_updated_at
BEFORE UPDATE ON public.measurements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();