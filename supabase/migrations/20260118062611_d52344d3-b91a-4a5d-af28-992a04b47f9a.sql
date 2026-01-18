-- Add new measurement columns
ALTER TABLE public.measurements
ADD COLUMN IF NOT EXISTS bust numeric,
ADD COLUMN IF NOT EXISTS upbust numeric,
ADD COLUMN IF NOT EXISTS underbust numeric,
ADD COLUMN IF NOT EXISTS shoulder_to_nipple numeric,
ADD COLUMN IF NOT EXISTS shoulder_to_underbust numeric,
ADD COLUMN IF NOT EXISTS shoulder_to_above_knee numeric,
ADD COLUMN IF NOT EXISTS shoulder_to_knee numeric,
ADD COLUMN IF NOT EXISTS half_length_front numeric,
ADD COLUMN IF NOT EXISTS half_length_back numeric,
ADD COLUMN IF NOT EXISTS blouse_length numeric,
ADD COLUMN IF NOT EXISTS short_length numeric,
ADD COLUMN IF NOT EXISTS midi_length numeric,
ADD COLUMN IF NOT EXISTS full_length numeric,
ADD COLUMN IF NOT EXISTS knee numeric,
ADD COLUMN IF NOT EXISTS ankle numeric,
ADD COLUMN IF NOT EXISTS trouser_length numeric,
ADD COLUMN IF NOT EXISTS armhole numeric,
ADD COLUMN IF NOT EXISTS round_sleeves numeric,
ADD COLUMN IF NOT EXISTS sleeve_length numeric;

-- Drop old columns that are no longer needed
ALTER TABLE public.measurements
DROP COLUMN IF EXISTS chest,
DROP COLUMN IF EXISTS arm_length,
DROP COLUMN IF EXISTS bicep,
DROP COLUMN IF EXISTS wrist,
DROP COLUMN IF EXISTS waist,
DROP COLUMN IF EXISTS inseam,
DROP COLUMN IF EXISTS outseam,
DROP COLUMN IF EXISTS height;

-- Rename hip to hips for consistency (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'measurements' AND column_name = 'hip') THEN
    ALTER TABLE public.measurements RENAME COLUMN hip TO hips;
  END IF;
END $$;