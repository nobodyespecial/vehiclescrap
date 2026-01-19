'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VehicleSearch from '@/components/VehicleSearch';
import { VehicleSearchCriteria, Vehicle } from '@/types/vehicle';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';

export default function SearchVehiclePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleType = searchParams.get('type') || '2W';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (criteria: VehicleSearchCriteria) => {
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch(`/api/vehicles/search?type=${vehicleType}`, {
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

      setVehicles(result.data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred during search');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`);
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
        <h1 className="text-3xl font-bold text-gray-900">Search Vehicle</h1>
        <p className="text-gray-600 mt-2">Search for vehicles by registration, RC, chassis, or engine number</p>
      </div>

      <div className="mb-8">
        <VehicleSearch onSearch={handleSearch} isLoading={isLoading} showDateFilters={true} />
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {hasSearched && !isLoading && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Results ({vehicles.length} found)
          </h2>
          {vehicles.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No vehicles found matching your search criteria.</p>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Registration Number</TableHeader>
                    <TableHeader>RC Number</TableHeader>
                    <TableHeader>Make</TableHeader>
                    <TableHeader>Model</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      clickable
                      onClick={() => handleRowClick(vehicle.id)}
                    >
                      <TableCell>{vehicle.registration_number}</TableCell>
                      <TableCell>{vehicle.rc_number}</TableCell>
                      <TableCell>{vehicle.make || 'N/A'}</TableCell>
                      <TableCell>{vehicle.model || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'Purchased' ? 'bg-blue-100 text-blue-800' :
                          vehicle.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                          vehicle.status === 'Received' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(vehicle.id);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
