import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Get vehicle analytics and statistics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    // Base query for user's vehicles
    let query = supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id);

    // Apply date filter if provided
    if (dateFrom) {
      query = query.gte('purchase_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('purchase_date', dateTo);
    }

    const { data: vehicles, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!vehicles || vehicles.length === 0) {
      return NextResponse.json({
        total: 0,
        byStatus: {},
        byType: {},
        byFuelType: {},
        purchasesByMonth: [],
        scrappedByMonth: [],
        totalValue: 0,
      });
    }

    // Calculate statistics
    const total = vehicles.length;
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byFuelType: Record<string, number> = {};
    let totalValue = 0;

    // Group by month for purchases
    const purchasesByMonthMap: Record<string, number> = {};
    const scrappedByMonthMap: Record<string, number> = {};

    vehicles.forEach((vehicle) => {
      // Status count
      byStatus[vehicle.status] = (byStatus[vehicle.status] || 0) + 1;

      // Type count
      byType[vehicle.vehicle_type] = (byType[vehicle.vehicle_type] || 0) + 1;

      // Fuel type count
      if (vehicle.fuel_type) {
        byFuelType[vehicle.fuel_type] = (byFuelType[vehicle.fuel_type] || 0) + 1;
      }

      // Total value
      if (vehicle.purchase_price) {
        totalValue += parseFloat(vehicle.purchase_price.toString());
      }

      // Purchases by month
      if (vehicle.purchase_date) {
        const date = new Date(vehicle.purchase_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        purchasesByMonthMap[monthKey] = (purchasesByMonthMap[monthKey] || 0) + 1;
      }

      // Scrapped by month (if status is Scrapped)
      if (vehicle.status === 'Scrapped' && vehicle.updated_at) {
        const date = new Date(vehicle.updated_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        scrappedByMonthMap[monthKey] = (scrappedByMonthMap[monthKey] || 0) + 1;
      }
    });

    // Convert to array format for charts
    const purchasesByMonth = Object.entries(purchasesByMonthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const scrappedByMonth = Object.entries(scrappedByMonthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({
      total,
      byStatus,
      byType,
      byFuelType,
      purchasesByMonth,
      scrappedByMonth,
      totalValue,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
