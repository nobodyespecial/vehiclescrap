'use client';

import { useState } from 'react';
import { VehicleSearchCriteria, VehicleType, VehicleStatus } from '@/types/vehicle';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface VehicleSearchProps {
  onSearch: (criteria: VehicleSearchCriteria) => void;
  isLoading?: boolean;
  showDateFilters?: boolean;
}

export default function VehicleSearch({ 
  onSearch, 
  isLoading = false,
  showDateFilters = false 
}: VehicleSearchProps) {
  const [criteria, setCriteria] = useState<VehicleSearchCriteria>({
    registration_number: '',
    rc_number: '',
    chassis_number: '',
    engine_number: '',
    purchase_date_from: '',
    purchase_date_to: '',
    status: undefined,
    vehicle_type: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if at least one field is filled
    const hasTextCriteria = 
      criteria.registration_number?.trim() ||
      criteria.rc_number?.trim() ||
      criteria.chassis_number?.trim() ||
      criteria.engine_number?.trim();
    
    const hasFilterCriteria = 
      criteria.purchase_date_from ||
      criteria.purchase_date_to ||
      criteria.status ||
      criteria.vehicle_type;

    if (hasTextCriteria || hasFilterCriteria) {
      onSearch(criteria);
    }
  };

  const handleReset = () => {
    setCriteria({
      registration_number: '',
      rc_number: '',
      chassis_number: '',
      engine_number: '',
      purchase_date_from: '',
      purchase_date_to: '',
      status: undefined,
      vehicle_type: undefined,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Vehicle</h3>
        
        {/* Filters Section */}
        {(showDateFilters || criteria.status || criteria.vehicle_type) && (
          <div className="border-b pb-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showDateFilters && (
                <>
                  <Input
                    label="Purchase Date From"
                    type="date"
                    value={criteria.purchase_date_from || ''}
                    onChange={(e) => setCriteria({ ...criteria, purchase_date_from: e.target.value })}
                  />
                  <Input
                    label="Purchase Date To"
                    type="date"
                    value={criteria.purchase_date_to || ''}
                    onChange={(e) => setCriteria({ ...criteria, purchase_date_to: e.target.value })}
                  />
                </>
              )}
              <Select
                label="Vehicle Type"
                value={criteria.vehicle_type || ''}
                onChange={(e) => setCriteria({ ...criteria, vehicle_type: e.target.value as VehicleType || undefined })}
                options={[
                  { value: '', label: 'All Types' },
                  { value: '2W', label: '2 Wheeler' },
                  { value: '4W', label: '4 Wheeler' },
                ]}
              />
              <Select
                label="Status"
                value={criteria.status || ''}
                onChange={(e) => setCriteria({ ...criteria, status: e.target.value as VehicleStatus || undefined })}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'Purchased', label: 'Purchased' },
                  { value: 'In Transit', label: 'In Transit' },
                  { value: 'Received', label: 'Received' },
                  { value: 'Scrapped', label: 'Scrapped' },
                ]}
              />
            </div>
          </div>
        )}

        {/* Text Search Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Search by Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Registration Number"
              value={criteria.registration_number || ''}
              onChange={(e) => setCriteria({ ...criteria, registration_number: e.target.value })}
              placeholder="Enter registration number"
            />
            <Input
              label="RC Number"
              value={criteria.rc_number || ''}
              onChange={(e) => setCriteria({ ...criteria, rc_number: e.target.value })}
              placeholder="Enter RC number"
            />
            <Input
              label="Chassis Number"
              value={criteria.chassis_number || ''}
              onChange={(e) => setCriteria({ ...criteria, chassis_number: e.target.value })}
              placeholder="Enter chassis number"
            />
            <Input
              label="Engine Number"
              value={criteria.engine_number || ''}
              onChange={(e) => setCriteria({ ...criteria, engine_number: e.target.value })}
              placeholder="Enter engine number"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
      </form>
    </Card>
  );
}
