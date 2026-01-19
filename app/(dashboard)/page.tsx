'use client';

import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Vehicle Scrapping Management
        </h1>
        <p className="text-lg text-gray-600">
          Select a vehicle type to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
        <Card
          hover
          clickable
          onClick={() => router.push('/dashboard')}
          className="text-center py-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
        >
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600 text-sm">
            View analytics & insights
          </p>
        </Card>

        <Card
          hover
          clickable
          onClick={() => router.push('/vehicles/2w')}
          className="text-center py-8"
        >
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
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            2 Wheeler Vehicles
          </h2>
          <p className="text-gray-600 text-sm">
            Manage two-wheeler vehicle records
          </p>
        </Card>

        <Card
          hover
          clickable
          onClick={() => router.push('/vehicles/4w')}
          className="text-center py-8"
        >
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            4 Wheeler Vehicles
          </h2>
          <p className="text-gray-600 text-sm">
            Manage four-wheeler vehicle records
          </p>
        </Card>
      </div>
    </div>
  );
}
