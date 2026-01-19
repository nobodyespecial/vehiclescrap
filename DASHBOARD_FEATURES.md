# Dashboard & Analytics Features

## Overview

The application now includes comprehensive date-based search functionality and a professional analytics dashboard to help you track and analyze your vehicle scrapping operations.

## New Features

### 1. Enhanced Search with Date Filters

**Location**: `/vehicles/search`

**New Capabilities**:
- **Date Range Search**: Filter vehicles by purchase date range (From Date - To Date)
- **Status Filter**: Filter by vehicle status (Purchased, In Transit, Received, Scrapped)
- **Vehicle Type Filter**: Filter by 2W or 4W
- **Combined Search**: Use text search (registration, RC, chassis, engine) along with filters

**How to Use**:
1. Navigate to Search Vehicle page
2. Use the "Filters" section to set date ranges, status, or vehicle type
3. Optionally add text search criteria
4. Click "Search" to see filtered results

### 2. Analytics Dashboard

**Location**: `/dashboard`

**Features**:

#### Statistics Cards
- **Total Vehicles**: Count of all vehicles in your system
- **Total Value**: Sum of all purchase prices
- **Scrapped**: Count of vehicles with "Scrapped" status
- **In Progress**: Count of vehicles in transit or received

#### Interactive Charts

1. **Vehicles Purchased Over Time** (Line Chart)
   - Shows monthly trend of vehicle purchases
   - Helps identify busy periods

2. **Vehicles Scrapped Over Time** (Bar Chart)
   - Shows monthly count of scrapped vehicles
   - Tracks scrapping progress

3. **Status Distribution** (Pie Chart)
   - Visual breakdown of vehicles by status
   - Quick overview of workflow status

4. **Vehicle Type Distribution** (Pie Chart)
   - 2W vs 4W breakdown
   - Understand your vehicle mix

5. **Fuel Type Distribution** (Pie Chart)
   - Petrol, Diesel, CNG, EV breakdown
   - Analyze fuel type trends

#### Date Range Filtering
- Filter all analytics by date range
- View statistics for specific time periods
- Compare performance across different periods

### 3. Navigation Updates

- **Dashboard Link**: Added to main navigation bar
- **Home Link**: Quick access to landing page
- **Dashboard Card**: Prominent card on landing page

## API Endpoints

### New Endpoint: `/api/vehicles/analytics`

**Method**: GET

**Query Parameters**:
- `date_from` (optional): Filter from this date (YYYY-MM-DD)
- `date_to` (optional): Filter to this date (YYYY-MM-DD)

**Response**:
```json
{
  "total": 12,
  "byStatus": {
    "Purchased": 5,
    "In Transit": 2,
    "Received": 3,
    "Scrapped": 2
  },
  "byType": {
    "2W": 6,
    "4W": 6
  },
  "byFuelType": {
    "Petrol": 4,
    "Diesel": 3,
    "CNG": 3,
    "EV": 2
  },
  "purchasesByMonth": [
    { "month": "2024-01", "count": 3 },
    { "month": "2024-02", "count": 5 }
  ],
  "scrappedByMonth": [
    { "month": "2024-01", "count": 1 },
    { "month": "2024-02", "count": 1 }
  ],
  "totalValue": 1250000.00
}
```

### Enhanced Endpoint: `/api/vehicles/search`

**New Query Parameters**:
- `purchase_date_from`: Filter vehicles purchased from this date
- `purchase_date_to`: Filter vehicles purchased to this date
- `status`: Filter by status
- `vehicle_type`: Filter by type (2W/4W)

## Use Cases

### 1. Monthly Purchase Report
- Go to Dashboard
- Set date range to specific month
- View purchases and scrapping for that month

### 2. Find Vehicles Purchased in a Period
- Go to Search Vehicle
- Set purchase date range
- View all vehicles purchased in that period

### 3. Track Scrapping Progress
- Go to Dashboard
- View "Scrapped Over Time" chart
- Monitor scrapping trends

### 4. Analyze Vehicle Mix
- Go to Dashboard
- View Type and Fuel Type distribution charts
- Understand your vehicle portfolio

### 5. Financial Overview
- Go to Dashboard
- Check "Total Value" card
- Filter by date to see value for specific periods

## Best Practices

1. **Regular Monitoring**: Check dashboard weekly to track operations
2. **Date Filtering**: Use date filters to compare periods
3. **Search Efficiency**: Combine filters for precise searches
4. **Data Analysis**: Use charts to identify trends and patterns

## Technical Details

- **Charts Library**: Recharts (React charting library)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Data**: All data fetched from Supabase in real-time
- **Performance**: Optimized queries with proper indexing

## Future Enhancements (Potential)

- Export reports to PDF/Excel
- Email notifications for milestones
- Custom date range presets (Last 7 days, Last month, etc.)
- Comparison views (month-over-month, year-over-year)
- Advanced filters (by location, by make/model)
- Vehicle lifecycle timeline view
