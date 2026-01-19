'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Vehicle, VehicleAttachment, AttachmentType } from '@/types/vehicle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function VehicleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState<VehicleAttachment[]>([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<AttachmentType>('photo');
  const [attachmentNotes, setAttachmentNotes] = useState('');

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

    const fetchAttachments = async () => {
      try {
        setIsLoadingAttachments(true);
        setAttachmentError('');
        const response = await fetch(`/api/vehicles/${vehicleId}/attachments`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch attachments');
        }

        setAttachments(result.data || []);
      } catch (err: any) {
        setAttachmentError(err.message || 'An error occurred while loading attachments');
      } finally {
        setIsLoadingAttachments(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
      fetchAttachments();
    }
  }, [vehicleId]);

  const handleUpload = async () => {
    if (!selectedFile || !vehicle) return;

    try {
      setUploading(true);
      setAttachmentError('');

      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error('You must be signed in to upload attachments');
      }

      const path = `${user.id}/${vehicle.id}/${Date.now()}_${selectedFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-files')
        .upload(path, selectedFile, {
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from('vehicle-files')
        .getPublicUrl(path);

      const fileUrl = publicUrlData.publicUrl;

      const response = await fetch(`/api/vehicles/${vehicle.id}/attachments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: attachmentType,
          file_url: fileUrl,
          notes: attachmentNotes || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save attachment');
      }

      setAttachments((prev) => [result.data, ...prev]);
      setSelectedFile(null);
      setAttachmentNotes('');
      const fileInput = document.getElementById('attachment-file-input') as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err: any) {
      setAttachmentError(err.message || 'An error occurred while uploading attachment');
    } finally {
      setUploading(false);
    }
  };

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

        <Card className="md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h2>
          {attachmentError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {attachmentError}
            </div>
          )}
          <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File
              </label>
              <input
                id="attachment-file-input"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-900
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={attachmentType}
                onChange={(e) => setAttachmentType(e.target.value as AttachmentType)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="photo">Photo</option>
                <option value="document">Document</option>
                <option value="invoice">Invoice</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <input
                type="text"
                value={attachmentNotes}
                onChange={(e) => setAttachmentNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="Description for this attachment"
              />
            </div>
            <div>
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                isLoading={uploading}
              >
                Upload
              </Button>
            </div>
          </div>

          <div>
            {isLoadingAttachments ? (
              <p className="text-sm text-gray-600">Loading attachments...</p>
            ) : attachments.length === 0 ? (
              <p className="text-sm text-gray-500">No attachments uploaded yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {attachments.map((att) => (
                  <li key={att.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {att.type}
                      </p>
                      {att.notes && (
                        <p className="text-sm text-gray-600">{att.notes}</p>
                      )}
                      {att.created_at && (
                        <p className="text-xs text-gray-400">
                          {formatDate(att.created_at)}
                        </p>
                      )}
                    </div>
                    <a
                      href={att.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
