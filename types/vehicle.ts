// Vehicle status types
export type VehicleStatus = 'Purchased' | 'In Transit' | 'Received' | 'Scrapped';
export type VehicleType = '2W' | '4W';
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'EV';
export type AttachmentType = 'photo' | 'document' | 'invoice';

// Vehicle interface matching database schema
export interface Vehicle {
  id: string;
  user_id: string;
  vehicle_type: VehicleType;
  registration_number: string;
  rc_number: string;
  chassis_number: string;
  engine_number?: string;
  make?: string;
  model?: string;
  year_of_manufacture?: number;
  fuel_type?: FuelType;
  owner_name?: string;
  purchase_date?: string; // ISO date string
  purchase_price?: number;
  pickup_location?: string;
  scrap_yard_location?: string;
  status: VehicleStatus;
  created_at?: string;
  updated_at?: string;
}

// Vehicle form data (without id, user_id, timestamps)
export interface VehicleFormData {
  vehicle_type: VehicleType;
  registration_number: string;
  rc_number: string;
  chassis_number: string;
  engine_number?: string;
  make?: string;
  model?: string;
  year_of_manufacture?: number;
  fuel_type?: FuelType;
  owner_name?: string;
  purchase_date?: string;
  purchase_price?: number;
  pickup_location?: string;
  scrap_yard_location?: string;
  status: VehicleStatus;
}

// Search criteria
export interface VehicleSearchCriteria {
  registration_number?: string;
  rc_number?: string;
  chassis_number?: string;
  engine_number?: string;
  purchase_date_from?: string;
  purchase_date_to?: string;
  status?: VehicleStatus;
  vehicle_type?: VehicleType;
}

export interface VehicleAttachment {
  id: string;
  vehicle_id: string;
  user_id: string;
  type: AttachmentType;
  file_url: string;
  notes?: string;
  created_at?: string;
}
