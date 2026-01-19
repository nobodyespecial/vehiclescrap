'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function TwoWheelerPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-900">2 Wheeler Vehicles</h1>
        <p className="text-gray-600 mt-2">Manage your two-wheeler vehicle records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <Card className="text-center py-8">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Vehicle</h2>
          <Button
            onClick={() => router.push('/vehicles/add?type=2W')}
            className="w-full"
          >
            Add Vehicle
          </Button>
        </Card>

        <Card className="text-center py-8">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Vehicle</h2>
          <Button
            variant="secondary"
            onClick={() => router.push('/vehicles/search?type=2W')}
            className="w-full"
          >
            Search Vehicle
          </Button>
        </Card>
      </div>
    </div>
  );
}
