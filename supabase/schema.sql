-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(2) NOT NULL CHECK (vehicle_type IN ('2W', '4W')),
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  rc_number VARCHAR(50) NOT NULL UNIQUE,
  chassis_number VARCHAR(100) NOT NULL UNIQUE,
  engine_number VARCHAR(100),
  make VARCHAR(100),
  model VARCHAR(100),
  year_of_manufacture INTEGER,
  fuel_type VARCHAR(20) CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'EV')),
  owner_name VARCHAR(200),
  purchase_date DATE,
  purchase_price DECIMAL(12, 2),
  pickup_location TEXT,
  scrap_yard_location TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Purchased' CHECK (status IN ('Purchased', 'In Transit', 'Received', 'Scrapped')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for searchable fields
CREATE INDEX IF NOT EXISTS idx_vehicles_registration_number ON vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_rc_number ON vehicles(rc_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_chassis_number ON vehicles(chassis_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_engine_number ON vehicles(engine_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_type ON vehicles(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own vehicles
CREATE POLICY "Users can view their own vehicles"
  ON vehicles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own vehicles
CREATE POLICY "Users can insert their own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own vehicles
CREATE POLICY "Users can update their own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
