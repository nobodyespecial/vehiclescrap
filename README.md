# Vehicle Scrapping Management System

A full-stack web application for managing vehicle scrapping operations, built with Next.js, React, Tailwind CSS, and Supabase.

## Features

- **Authentication**: Secure user authentication with Supabase Auth
- **Vehicle Management**: 
  - Add new vehicles (2W and 4W)
  - Search vehicles by registration number, RC number, chassis number, or engine number
  - Update vehicle details
  - View complete vehicle information
- **Multi-user Support**: Each user can only access their own vehicle records
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Validation**: Prevents duplicate entries and validates all inputs

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd scrap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com) and create a new project
2. Once your project is ready, navigate to **Settings > API**
3. Copy your **Project URL** and **anon/public key**

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from your Supabase project.

### 5. Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL script in the SQL Editor
4. This will create the `vehicles` table with all necessary constraints, indexes, and RLS policies

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses a single `vehicles` table with the following structure:

- **Unique Constraints**: `registration_number`, `rc_number`, `chassis_number`
- **Indexes**: Created on all searchable fields for optimal performance
- **Row Level Security (RLS)**: Enabled to ensure users can only access their own data
- **Automatic Timestamps**: `created_at` and `updated_at` are automatically managed

See `supabase/schema.sql` for the complete schema definition.

## Project Structure

```
scrap/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── page.tsx         # Landing page
│   │   └── vehicles/        # Vehicle management pages
│   ├── api/                 # API routes
│   │   └── vehicles/        # Vehicle CRUD endpoints
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── VehicleForm.tsx      # Vehicle form component
│   ├── VehicleSearch.tsx    # Search component
│   └── VehicleDetails.tsx   # Details display component
├── lib/
│   ├── supabase/            # Supabase client utilities
│   └── utils.ts             # Utility functions
├── types/
│   └── vehicle.ts           # TypeScript types
├── supabase/
│   └── schema.sql           # Database schema
└── middleware.ts            # Route protection middleware
```

## Usage

### Authentication

1. Start by signing up with your email and password
2. After signup, you'll be automatically logged in
3. Use the "Sign Out" button in the navigation to log out

### Adding a Vehicle

1. From the landing page, select either "2 Wheeler Vehicles" or "4 Wheeler Vehicles"
2. Click "Add New Vehicle"
3. Fill in the required fields:
   - Vehicle Registration Number (required, unique)
   - RC Number (required, unique)
   - Chassis Number (required, unique)
   - Other fields are optional
4. Click "Add Vehicle" to save

### Searching for a Vehicle

1. Navigate to the vehicle type page (2W or 4W)
2. Click "Search Vehicle"
3. Enter any of the following:
   - Registration Number
   - RC Number
   - Chassis Number
   - Engine Number
4. Click "Search" to view matching results
5. Click on any result to view full details

### Updating a Vehicle

1. Go to the Update Vehicle page
2. Search for the vehicle you want to update
3. Select the vehicle from search results
4. Modify the fields as needed
5. Click "Update Vehicle" to save changes

### Viewing Vehicle Details

- Click on any vehicle from search results to view complete details
- All vehicle information is displayed in an organized, readable format

## API Routes

- `GET /api/vehicles` - Fetch vehicles (supports `?type=2W` and `?status=...` filters)
- `POST /api/vehicles` - Create a new vehicle
- `GET /api/vehicles/[id]` - Get a single vehicle by ID
- `PUT /api/vehicles/[id]` - Update a vehicle
- `POST /api/vehicles/search` - Search vehicles by multiple criteria

## Features & Validation

- **Duplicate Prevention**: The system prevents duplicate entries for registration number, RC number, and chassis number
- **Input Validation**: All required fields are validated on both client and server side
- **Status Tracking**: Track vehicle status through: Purchased → In Transit → Received → Scrapped
- **Multi-user Isolation**: Each user's data is completely isolated using Row Level Security

## Building for Production

```bash
npm run build
npm start
```

## Releases

- **v1.2.0** – Attachments/documents per vehicle (photos, documents, invoices).
- **v1.1.0** – CSV exports for All Vehicles and Search results.
- **v1.0.0** – First public release (authentication, vehicle CRUD, analytics dashboard).

## Troubleshooting

### Database Connection Issues

- Verify your `.env.local` file has the correct Supabase URL and key
- Ensure your Supabase project is active and not paused

### Authentication Issues

- Make sure you've run the database schema SQL script
- Check that Row Level Security policies are enabled

### Duplicate Entry Errors

- The system enforces unique constraints on registration number, RC number, and chassis number
- Ensure you're not trying to add a vehicle that already exists

## License

This project is open source and available for use.

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
