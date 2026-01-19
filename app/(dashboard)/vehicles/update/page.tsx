'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VehicleForm from '@/components/VehicleForm';
import VehicleSearch from '@/components/VehicleSearch';
import { VehicleFormData, VehicleSearchCriteria, Vehicle } from '@/types/vehicle';
import Button from '@/components/ui/Button';

export default function UpdateVehiclePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id');

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [showSearch, setShowSearch] = useState(!vehicleId);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle(vehicleId);
    }
  }, [vehicleId]);

  const fetchVehicle = async (id: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/vehicles/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch vehicle');
      }

      setSelectedVehicle(result.data);
      setShowSearch(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (criteria: VehicleSearchCriteria) => {
    setIsSearching(true);
    setError('');

    try {
      const response = await fetch('/api/vehicles/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Search failed');
      }

      setSearchResults(result.data || []);
      if (result.data && result.data.length === 0) {
        setError('No vehicles found matching your search criteria');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during search');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowSearch(false);
    setSearchResults([]);
  };

  const handleSubmit = async (data: VehicleFormData) => {
    if (!selectedVehicle) return;

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`/api/vehicles/${selectedVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update vehicle');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/vehicles/${selectedVehicle.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the vehicle');
      setIsLoading(false);
    }
  };

  if (isLoading && !selectedVehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle...</p>
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Update Vehicle</h1>
        <p className="text-gray-600 mt-2">Search for a vehicle to update its details</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Vehicle updated successfully! Redirecting...
        </div>
      )}

      {showSearch ? (
        <div>
          <VehicleSearch onSearch={handleSearch} isLoading={isSearching} />

          {searchResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Vehicle to Update</h2>
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RC Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Make/Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResults.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.registration_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.rc_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vehicle.make || 'N/A'} / {vehicle.model || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            vehicle.status === 'Purchased' ? 'bg-blue-100 text-blue-800' :
                            vehicle.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                            vehicle.status === 'Received' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            size="sm"
                            onClick={() => handleSelectVehicle(vehicle)}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : selectedVehicle ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Updating: <span className="font-medium">{selectedVehicle.registration_number}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSearch(true);
                setSelectedVehicle(null);
              }}
            >
              Search Different Vehicle
            </Button>
          </div>
          <VehicleForm
            initialData={selectedVehicle}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Update Vehicle"
          />
        </div>
      ) : null}
    </div>
  );
}
