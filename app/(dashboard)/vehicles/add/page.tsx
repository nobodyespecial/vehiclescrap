'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VehicleForm from '@/components/VehicleForm';
import { VehicleFormData, VehicleType } from '@/types/vehicle';
import Button from '@/components/ui/Button';

export default function AddVehiclePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const vehicleType = (searchParams.get('type') as VehicleType) || '2W';

  const handleSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create vehicle');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/vehicles/${vehicleType.toLowerCase()}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the vehicle');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <button
          onClick={() => router.push(`/vehicles/${vehicleType.toLowerCase()}`)}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
        <p className="text-gray-600 mt-2">Enter vehicle details below</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Vehicle added successfully! Redirecting...
        </div>
      )}

      <VehicleForm
        initialData={{ vehicle_type: vehicleType }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Add Vehicle"
      />
    </div>
  );
}
