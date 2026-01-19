-- Vehicle attachments table for documents and photos
CREATE TABLE IF NOT EXISTS vehicle_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'document', 'invoice')),
  file_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_attachments_vehicle_id
  ON vehicle_attachments(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_vehicle_attachments_user_id
  ON vehicle_attachments(user_id);

ALTER TABLE vehicle_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attachments"
  ON vehicle_attachments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attachments"
  ON vehicle_attachments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

