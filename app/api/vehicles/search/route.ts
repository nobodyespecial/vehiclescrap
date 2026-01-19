import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { VehicleSearchCriteria } from '@/types/vehicle';

// POST: Search vehicles by multiple criteria
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const criteria: VehicleSearchCriteria = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const vehicleType = searchParams.get('type');

    let query = supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id);

    if (vehicleType) {
      query = query.eq('vehicle_type', vehicleType);
    }

    // Apply filters
    if (criteria.vehicle_type) {
      query = query.eq('vehicle_type', criteria.vehicle_type);
    }

    if (criteria.status) {
      query = query.eq('status', criteria.status);
    }

    // Date range filters
    if (criteria.purchase_date_from) {
      query = query.gte('purchase_date', criteria.purchase_date_from);
    }
    if (criteria.purchase_date_to) {
      query = query.lte('purchase_date', criteria.purchase_date_to);
    }

    // Build search conditions for text fields
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

    // Apply text search conditions if any
    if (conditions.length > 0) {
      query = query.or(conditions.join(','));
    } else if (
      !criteria.vehicle_type &&
      !criteria.status &&
      !criteria.purchase_date_from &&
      !criteria.purchase_date_to
    ) {
      // If no search criteria at all, return empty result
      return NextResponse.json({ data: [] });
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
