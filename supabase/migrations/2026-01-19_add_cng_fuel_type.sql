-- Migration: allow 'CNG' as a fuel_type value
-- Run this in Supabase SQL Editor if you already created the table from the older schema.

DO $$
BEGIN
  -- Drop the existing CHECK constraint on fuel_type (name may differ across environments)
  -- Find the actual constraint name with:
  --   SELECT conname FROM pg_constraint
  --   WHERE conrelid = 'public.vehicles'::regclass AND contype = 'c';

  -- Attempt common auto-generated name first; ignore if not found
  BEGIN
    ALTER TABLE public.vehicles DROP CONSTRAINT vehicles_fuel_type_check;
  EXCEPTION
    WHEN undefined_object THEN
      -- ignore
  END;

  -- Re-add with CNG included
  ALTER TABLE public.vehicles
    ADD CONSTRAINT vehicles_fuel_type_check
    CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'EV'));
END $$;

