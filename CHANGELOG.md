# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-19

- Added CSV export for vehicles:
  - New `/api/vehicles/export` endpoint that accepts the same filters as the search API.
  - Export button on \"All Vehicles\" and \"Search Vehicle\" pages to download filtered data as CSV.

## [1.0.0] - 2026-01-19

- Initial public version deployed to Vercel.
- Core features:
  - Supabase authentication (signup/login, protected dashboard).
  - Vehicle management: add, search, update, view details for 2W/4W.
  - Analytics dashboard with status/type/fuel breakdown and time-series charts.
  - Basic responsive layout and reusable UI components.

