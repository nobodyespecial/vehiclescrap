'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vehicle } from '@/types/vehicle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AllVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/vehicles');
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch vehicles');
      }
      setVehicles(result.data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    if (!search.trim()) return vehicles;
    const term = search.toLowerCase();
    return vehicles.filter((v) =>
      [
        v.registration_number,
        v.rc_number,
        v.chassis_number,
        v.engine_number,
        v.make,
        v.model,
        v.status,
        v.vehicle_type,
        v.fuel_type,
      ]
        .filter(Boolean)
        .some((field) => field!.toString().toLowerCase().includes(term))
    );
  }, [vehicles, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">All Vehicles</h1>
          <p className="text-gray-600 mt-2">Excel-like table view of all vehicles</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <Input
            label="Quick Search"
            placeholder="Search registration, RC, chassis, engine, make, model, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-80"
          />
          <Button variant="secondary" onClick={fetchVehicles} isLoading={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center text-gray-600">Loading vehicles...</div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-12 text-center text-gray-600">No vehicles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableHeader>Registration</TableHeader>
                  <TableHeader>RC</TableHeader>
                  <TableHeader>Chassis</TableHeader>
                  <TableHeader>Engine</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Fuel</TableHeader>
                  <TableHeader>Make / Model</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Purchase Date</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Details</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-semibold">{v.registration_number}</TableCell>
                    <TableCell>{v.rc_number}</TableCell>
                    <TableCell>{v.chassis_number}</TableCell>
                    <TableCell>{v.engine_number || '—'}</TableCell>
                    <TableCell>{v.vehicle_type}</TableCell>
                    <TableCell>{v.fuel_type || '—'}</TableCell>
                    <TableCell>{[v.make, v.model].filter(Boolean).join(' ') || '—'}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          v.status === 'Purchased'
                            ? 'bg-blue-100 text-blue-800'
                            : v.status === 'In Transit'
                            ? 'bg-yellow-100 text-yellow-800'
                            : v.status === 'Received'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(v.purchase_date)}</TableCell>
                    <TableCell>{formatCurrency(v.purchase_price)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/vehicles/${v.id}`)}
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
      </Card>
    </div>
  );
}

