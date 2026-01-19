import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { VehicleSearchCriteria } from '@/types/vehicle';

function toCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// POST: Export vehicles as CSV using same filters as search endpoint
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const criteria: VehicleSearchCriteria = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const vehicleType = searchParams.get('type');

    let query = supabase.from('vehicles').select('*').eq('user_id', user.id);

    if (vehicleType) {
      query = query.eq('vehicle_type', vehicleType);
    }

    if (criteria.vehicle_type) {
      query = query.eq('vehicle_type', criteria.vehicle_type);
    }

    if (criteria.status) {
      query = query.eq('status', criteria.status);
    }

    if (criteria.purchase_date_from) {
      query = query.gte('purchase_date', criteria.purchase_date_from);
    }
    if (criteria.purchase_date_to) {
      query = query.lte('purchase_date', criteria.purchase_date_to);
    }

    const conditions: string[] = [];

    if (criteria.registration_number) {
      conditions.push(`registration_number.ilike.%${criteria.registration_number}%`);
    }
    if (criteria.rc_number) {
      conditions.push(`rc_number.ilike.%${criteria.rc_number}%`);
    }
    if (criteria.chassis_number) {
      conditions.push(`chassis_number.ilike.%${criteria.chassis_number}%`);
    }
    if (criteria.engine_number) {
      conditions.push(`engine_number.ilike.%${criteria.engine_number}%`);
    }

    if (conditions.length > 0) {
      query = query.or(conditions.join(','));
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const vehicles = data || [];

    const headers = [
      'Registration Number',
      'RC Number',
      'Chassis Number',
      'Engine Number',
      'Vehicle Type',
      'Fuel Type',
      'Make',
      'Model',
      'Year of Manufacture',
      'Owner Name',
      'Purchase Date',
      'Purchase Price',
      'Pickup Location',
      'Scrap Yard Location',
      'Status',
      'Created At',
      'Updated At',
    ];

    const rows = vehicles.map((v) => [
      toCsvValue(v.registration_number),
      toCsvValue(v.rc_number),
      toCsvValue(v.chassis_number),
      toCsvValue(v.engine_number),
      toCsvValue(v.vehicle_type),
      toCsvValue(v.fuel_type),
      toCsvValue(v.make),
      toCsvValue(v.model),
      toCsvValue(v.year_of_manufacture),
      toCsvValue(v.owner_name),
      toCsvValue(v.purchase_date),
      toCsvValue(v.purchase_price),
      toCsvValue(v.pickup_location),
      toCsvValue(v.scrap_yard_location),
      toCsvValue(v.status),
      toCsvValue(v.created_at),
      toCsvValue(v.updated_at),
    ]);

    const csvLines = [
      headers.map(toCsvValue).join(','),
      ...rows.map((row) => row.join(',')),
    ];

    const csvContent = csvLines.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="vehicles_export.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

