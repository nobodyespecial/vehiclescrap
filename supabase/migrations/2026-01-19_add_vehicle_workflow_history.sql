-- Workflow enhancements: expected scrap date, notes, and status history

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS expected_scrap_date DATE,
  ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_vehicles_expected_scrap_date
  ON vehicles(expected_scrap_date);

-- Status history table
CREATE TABLE IF NOT EXISTS vehicle_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_status_history_vehicle_id
  ON vehicle_status_history(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vehicle_status_history_user_id
  ON vehicle_status_history(user_id);

ALTER TABLE vehicle_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own status history"
  ON vehicle_status_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own status history"
  ON vehicle_status_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

