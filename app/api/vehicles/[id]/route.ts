import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { VehicleFormData } from '@/types/vehicle';

// GET: Fetch single vehicle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: vehicle });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update vehicle with validation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if vehicle exists and belongs to user
    const { data: existingVehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const body: Partial<VehicleFormData> = await request.json();

    // Check for duplicates (excluding current vehicle)
    if (body.registration_number || body.rc_number || body.chassis_number) {
      const conditions: string[] = [];
      if (body.registration_number) {
        conditions.push(`registration_number.eq.${body.registration_number}`);
      }
      if (body.rc_number) {
        conditions.push(`rc_number.eq.${body.rc_number}`);
      }
      if (body.chassis_number) {
        conditions.push(`chassis_number.eq.${body.chassis_number}`);
      }

      if (conditions.length > 0) {
        const { data: duplicates, error: checkError } = await supabase
          .from('vehicles')
          .select('registration_number, rc_number, chassis_number')
          .or(conditions.join(','))
          .eq('user_id', user.id)
          .neq('id', params.id);

        if (checkError) {
          return NextResponse.json({ error: checkError.message }, { status: 400 });
        }

        if (duplicates && duplicates.length > 0) {
          const duplicateFields = duplicates.map(v => {
            if (body.registration_number && v.registration_number === body.registration_number) return 'Registration Number';
            if (body.rc_number && v.rc_number === body.rc_number) return 'RC Number';
            if (body.chassis_number && v.chassis_number === body.chassis_number) return 'Chassis Number';
            return '';
          }).filter(Boolean);

          return NextResponse.json(
            { error: `Duplicate entry found: ${duplicateFields.join(', ')}` },
            { status: 409 }
          );
        }
      }
    }

    // Update vehicle
    const updateData: any = {};
    if (body.vehicle_type !== undefined) updateData.vehicle_type = body.vehicle_type;
    if (body.registration_number !== undefined) updateData.registration_number = body.registration_number;
    if (body.rc_number !== undefined) updateData.rc_number = body.rc_number;
    if (body.chassis_number !== undefined) updateData.chassis_number = body.chassis_number;
    if (body.engine_number !== undefined) updateData.engine_number = body.engine_number || null;
    if (body.make !== undefined) updateData.make = body.make || null;
    if (body.model !== undefined) updateData.model = body.model || null;
    if (body.year_of_manufacture !== undefined) updateData.year_of_manufacture = body.year_of_manufacture || null;
    if (body.fuel_type !== undefined) updateData.fuel_type = body.fuel_type || null;
    if (body.owner_name !== undefined) updateData.owner_name = body.owner_name || null;
    if (body.purchase_date !== undefined) updateData.purchase_date = body.purchase_date || null;
    if (body.purchase_price !== undefined) updateData.purchase_price = body.purchase_price || null;
    if (body.pickup_location !== undefined) updateData.pickup_location = body.pickup_location || null;
    if (body.scrap_yard_location !== undefined) updateData.scrap_yard_location = body.scrap_yard_location || null;
    if (body.expected_scrap_date !== undefined) updateData.expected_scrap_date = body.expected_scrap_date || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.status !== undefined) updateData.status = body.status;

    const fromStatus = existingVehicle.status;
    const toStatus = body.status !== undefined ? body.status : existingVehicle.status;

    const { data: updatedVehicle, error: updateError } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: 'A vehicle with this information already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Write status history record only if status actually changed
    if (body.status !== undefined && fromStatus !== toStatus) {
      await supabase.from('vehicle_status_history').insert({
        vehicle_id: params.id,
        user_id: user.id,
        from_status: fromStatus,
        to_status: toStatus,
        note: null,
      });
    }

    return NextResponse.json({ data: updatedVehicle });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
