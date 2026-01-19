'use client';

import { useState, useEffect } from 'react';
import { VehicleFormData, VehicleType, FuelType, VehicleStatus } from '@/types/vehicle';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function VehicleForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Submit',
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicle_type: initialData?.vehicle_type || '2W',
    registration_number: initialData?.registration_number || '',
    rc_number: initialData?.rc_number || '',
    chassis_number: initialData?.chassis_number || '',
    engine_number: initialData?.engine_number || '',
    make: initialData?.make || '',
    model: initialData?.model || '',
    year_of_manufacture: initialData?.year_of_manufacture,
    fuel_type: initialData?.fuel_type,
    owner_name: initialData?.owner_name || '',
    purchase_date: initialData?.purchase_date || '',
    purchase_price: initialData?.purchase_price,
    pickup_location: initialData?.pickup_location || '',
    scrap_yard_location: initialData?.scrap_yard_location || '',
    status: initialData?.status || 'Purchased',
    expected_scrap_date: initialData?.expected_scrap_date || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.registration_number.trim()) {
      newErrors.registration_number = 'Registration number is required';
    }
    if (!formData.rc_number.trim()) {
      newErrors.rc_number = 'RC number is required';
    }
    if (!formData.chassis_number.trim()) {
      newErrors.chassis_number = 'Chassis number is required';
    }
    if (formData.year_of_manufacture && formData.year_of_manufacture < 1900) {
      newErrors.year_of_manufacture = 'Invalid year';
    }
    if (formData.year_of_manufacture && formData.year_of_manufacture > new Date().getFullYear() + 1) {
      newErrors.year_of_manufacture = 'Year cannot be in the future';
    }
    if (formData.purchase_price && formData.purchase_price < 0) {
      newErrors.purchase_price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    await onSubmit(formData);
  };

  const handleChange = (field: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Vehicle Type"
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={(e) => handleChange('vehicle_type', e.target.value as VehicleType)}
            options={[
              { value: '2W', label: '2 Wheeler' },
              { value: '4W', label: '4 Wheeler' },
            ]}
            required
            error={errors.vehicle_type}
          />

          <Input
            label="Vehicle Registration Number"
            name="registration_number"
            value={formData.registration_number}
            onChange={(e) => handleChange('registration_number', e.target.value.toUpperCase())}
            required
            error={errors.registration_number}
            placeholder="e.g., MH12AB1234"
          />

          <Input
            label="RC Number"
            name="rc_number"
            value={formData.rc_number}
            onChange={(e) => handleChange('rc_number', e.target.value.toUpperCase())}
            required
            error={errors.rc_number}
          />

          <Input
            label="Chassis Number"
            name="chassis_number"
            value={formData.chassis_number}
            onChange={(e) => handleChange('chassis_number', e.target.value.toUpperCase())}
            required
            error={errors.chassis_number}
          />

          <Input
            label="Engine Number"
            name="engine_number"
            value={formData.engine_number || ''}
            onChange={(e) => handleChange('engine_number', e.target.value.toUpperCase())}
            error={errors.engine_number}
          />

          <Input
            label="Make"
            name="make"
            value={formData.make || ''}
            onChange={(e) => handleChange('make', e.target.value)}
            placeholder="e.g., Honda, Maruti"
          />

          <Input
            label="Model"
            name="model"
            value={formData.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="e.g., Activa, Swift"
          />

          <Input
            label="Year of Manufacture"
            name="year_of_manufacture"
            type="number"
            value={formData.year_of_manufacture || ''}
            onChange={(e) => handleChange('year_of_manufacture', e.target.value ? parseInt(e.target.value) : undefined)}
            min="1900"
            max={new Date().getFullYear() + 1}
            error={errors.year_of_manufacture}
          />

          <Select
            label="Fuel Type"
            name="fuel_type"
            value={formData.fuel_type || ''}
            onChange={(e) => handleChange('fuel_type', e.target.value || undefined)}
            options={[
              { value: '', label: 'Select fuel type' },
              { value: 'Petrol', label: 'Petrol' },
              { value: 'Diesel', label: 'Diesel' },
              { value: 'CNG', label: 'CNG' },
              { value: 'EV', label: 'EV' },
            ]}
            error={errors.fuel_type}
          />

          <Input
            label="Owner Name"
            name="owner_name"
            value={formData.owner_name || ''}
            onChange={(e) => handleChange('owner_name', e.target.value)}
            placeholder="Optional"
          />

          <Input
            label="Purchase Date"
            name="purchase_date"
            type="date"
            value={formData.purchase_date || ''}
            onChange={(e) => handleChange('purchase_date', e.target.value)}
            error={errors.purchase_date}
          />

          <Input
            label="Purchase Price"
            name="purchase_price"
            type="number"
            step="0.01"
            value={formData.purchase_price || ''}
            onChange={(e) => handleChange('purchase_price', e.target.value ? parseFloat(e.target.value) : undefined)}
            min="0"
            error={errors.purchase_price}
            placeholder="0.00"
          />

          <Input
            label="Pickup Location"
            name="pickup_location"
            value={formData.pickup_location || ''}
            onChange={(e) => handleChange('pickup_location', e.target.value)}
            placeholder="Address where vehicle was picked up"
          />

          <Input
            label="Scrap Yard Location"
            name="scrap_yard_location"
            value={formData.scrap_yard_location || ''}
            onChange={(e) => handleChange('scrap_yard_location', e.target.value)}
            placeholder="Address of scrap yard"
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as VehicleStatus)}
            options={[
              { value: 'Purchased', label: 'Purchased' },
              { value: 'In Transit', label: 'In Transit' },
              { value: 'Received', label: 'Received' },
              { value: 'Scrapped', label: 'Scrapped' },
            ]}
            required
            error={errors.status}
          />

          <Input
            label="Expected Scrap Date"
            name="expected_scrap_date"
            type="date"
            value={formData.expected_scrap_date || ''}
            onChange={(e) => handleChange('expected_scrap_date', e.target.value)}
            error={errors.expected_scrap_date}
          />

          <div className="w-full md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 min-h-[96px]"
              placeholder="Any additional notes about this vehicle..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
