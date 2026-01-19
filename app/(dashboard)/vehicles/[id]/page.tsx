'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Vehicle } from '@/types/vehicle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function VehicleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch vehicle');
        }

        setVehicle(result.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Vehicle not found'}
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
            <p className="text-gray-600 mt-2">Registration: {vehicle.registration_number}</p>
          </div>
          <Button
            onClick={() => router.push(`/vehicles/update?id=${vehicle.id}`)}
          >
            Edit Vehicle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.vehicle_type} Wheeler</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.registration_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">RC Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.rc_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Chassis Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.chassis_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Engine Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.engine_number || 'N/A'}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Make</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.make || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Model</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.model || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Year of Manufacture</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.year_of_manufacture || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.fuel_type || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Owner Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.owner_name || 'N/A'}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(vehicle.purchase_date)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Purchase Price</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatCurrency(vehicle.purchase_price)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'Purchased' ? 'bg-blue-100 text-blue-800' :
                  vehicle.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                  vehicle.status === 'Received' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {vehicle.status}
                </span>
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Information</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Pickup Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.pickup_location || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Scrap Yard Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.scrap_yard_location || 'N/A'}</dd>
            </div>
            {vehicle.created_at && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(vehicle.created_at)}</dd>
              </div>
            )}
            {vehicle.updated_at && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(vehicle.updated_at)}</dd>
              </div>
            )}
          </dl>
        </Card>
      </div>
    </div>
  );
}
