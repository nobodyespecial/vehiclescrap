import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { VehicleFormData } from '@/types/vehicle';

// GET: Fetch vehicles (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const vehicleType = searchParams.get('type');
    const status = searchParams.get('status');

    let query = supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (vehicleType) {
      query = query.eq('vehicle_type', vehicleType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create new vehicle with duplicate validation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: VehicleFormData = await request.json();

    // Validate required fields
    if (!body.registration_number || !body.rc_number || !body.chassis_number) {
      return NextResponse.json(
        { error: 'Registration number, RC number, and Chassis number are required' },
        { status: 400 }
      );
    }

    // Check for duplicates
    const { data: existingVehicles, error: checkError } = await supabase
      .from('vehicles')
      .select('registration_number, rc_number, chassis_number')
      .or(`registration_number.eq.${body.registration_number},rc_number.eq.${body.rc_number},chassis_number.eq.${body.chassis_number}`)
      .eq('user_id', user.id);

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 400 });
    }

    if (existingVehicles && existingVehicles.length > 0) {
      const duplicates = existingVehicles.map(v => {
        if (v.registration_number === body.registration_number) return 'Registration Number';
        if (v.rc_number === body.rc_number) return 'RC Number';
        if (v.chassis_number === body.chassis_number) return 'Chassis Number';
        return '';
      }).filter(Boolean);

      return NextResponse.json(
        { error: `Duplicate entry found: ${duplicates.join(', ')}` },
        { status: 409 }
      );
    }

    // Insert new vehicle
    const { data: newVehicle, error: insertError } = await supabase
      .from('vehicles')
      .insert({
        user_id: user.id,
        vehicle_type: body.vehicle_type,
        registration_number: body.registration_number,
        rc_number: body.rc_number,
        chassis_number: body.chassis_number,
        engine_number: body.engine_number || null,
        make: body.make || null,
        model: body.model || null,
        year_of_manufacture: body.year_of_manufacture || null,
        fuel_type: body.fuel_type || null,
        owner_name: body.owner_name || null,
        purchase_date: body.purchase_date || null,
        purchase_price: body.purchase_price || null,
        pickup_location: body.pickup_location || null,
        scrap_yard_location: body.scrap_yard_location || null,
        status: body.status || 'Purchased',
      })
      .select()
      .single();

    if (insertError) {
      // Check if it's a unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'A vehicle with this information already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ data: newVehicle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
