# Plan to Integrate Booking Process with Supabase

This plan outlines the steps to fully integrate the booking process with your Supabase backend, replacing the current use of static data and local state simulations.

## Phase 1: Database Schema Design and Creation

We need to create the following tables in your Supabase project (`ooswtfgykyyatgasdgqz`) to store the booking-related data:

1.  **`courses` table:** To store details about the training packages.
    *   `id` (UUID, Primary Key, auto-generated)
    *   `title` (TEXT)
    *   `description` (TEXT)
    *   `price` (DECIMAL)
    *   `duration` (INTEGER) - in days
    *   `rounds` (INTEGER)
    *   `hotel` (TEXT, nullable)
    *   `transport` (TEXT, nullable)
    *   `includes` (JSONB) - array of strings
    *   `created_at` (TIMESTAMP WITH TIME ZONE, default now())

2.  **`extras` table:** To store details about optional add-ons.
    *   `id` (UUID, Primary Key, auto-generated)
    *   `name` (TEXT)
    *   `description` (TEXT, nullable)
    *   `price` (DECIMAL)
    *   `category` (TEXT) - e.g., 'experience', 'tactical', 'accommodation', 'media'
    *   `created_at` (TIMESTAMP WITH TIME ZONE, default now())

3.  **`course_dates` table:** (Already exists, but we'll ensure its structure is correct and potentially add a foreign key)
    *   `id` (UUID, Primary Key, auto-generated)
    *   `course_id` (UUID, Foreign Key referencing `courses.id`)
    *   `start_date` (TIMESTAMP WITH TIME ZONE)
    *   `end_date` (TIMESTAMP WITH TIME ZONE)
    *   `max_participants` (INTEGER, default 10)
    *   `current_participants` (INTEGER, default 0)
    *   `created_at` (TIMESTAMP WITH TIME ZONE, default now())

4.  **`bookings` table:** To store individual user booking records.
    *   `id` (UUID, Primary Key, auto-generated)
    *   `user_id` (UUID, Foreign Key referencing `auth.users.id`)
    *   `course_id` (UUID, Foreign Key referencing `courses.id`)
    *   `course_date_id` (UUID, Foreign Key referencing `course_dates.id`)
    *   `status` (TEXT, e.g., 'pending_deposit', 'deposit_paid', 'confirmed', 'cancelled')
    *   `payment_status` (TEXT, e.g., 'unpaid', 'deposit_due', 'paid_in_full')
    *   `total_amount` (DECIMAL)
    *   `created_at` (TIMESTAMP WITH TIME ZONE, default now())
    *   `updated_at` (TIMESTAMP WITH TIME ZONE, default now())
    *   `forms_filled` (BOOLEAN, default false)
    *   `files_uploaded` (BOOLEAN, default false)

5.  **`booking_extras` table:** A linking table to associate extras with bookings (many-to-many relationship).
    *   `id` (UUID, Primary Key, auto-generated)
    *   `booking_id` (UUID, Foreign Key referencing `bookings.id`)
    *   `extra_id` (UUID, Foreign Key referencing `extras.id`)
    *   `price_at_booking` (DECIMAL) - store the price at the time of booking
    *   `created_at` (TIMESTAMP WITH TIME ZONE, default now())

## Database Schema Diagram (Mermaid):

```mermaid
erDiagram
    "auth.users" {
        uuid id PK
        text email
        text role
        ...
    }
    courses {
        uuid id PK
        text title
        text description
        decimal price
        integer duration
        integer rounds
        text hotel
        text transport
        jsonb includes
        timestamptz created_at
    }
    extras {
        uuid id PK
        text name
        text description
        decimal price
        text category
        timestamptz created_at
    }
    course_dates {
        uuid id PK
        uuid course_id FK
        timestamptz start_date
        timestamptz end_date
        integer max_participants
        integer current_participants
        timestamptz created_at
    }
    bookings {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        uuid course_date_id FK
        text status
        text payment_status
        decimal total_amount
        timestamptz created_at
        timestamptz updated_at
        boolean forms_filled
        boolean files_uploaded
    }
    booking_extras {
        uuid id PK
        uuid booking_id FK
        uuid extra_id FK
        decimal price_at_booking
        timestamptz created_at
    }

    "auth.users" ||--o{ bookings : "has"
    courses ||--o{ course_dates : "has"
    courses ||--o{ bookings : "includes"
    course_dates ||--o{ bookings : "scheduled_on"
    bookings ||--o{ booking_extras : "includes"
    extras ||--o{ booking_extras : "included_in"
```

## Phase 2: Data Migration (Optional but Recommended)

*   Migrate the data from `src/data/courses.ts` into the new `courses` table.
*   Migrate the data from `src/data/extras.ts` into the new `extras` table.
*   Migrate the data from `src/data/dates.ts` into the existing `course_dates` table, ensuring `course_id` is correctly linked to the new `courses` table IDs.

## Phase 3: Frontend Implementation

1.  **Update Supabase Types:** Generate updated TypeScript types from your Supabase project to reflect the new tables. This is typically done with the Supabase CLI (`supabase gen types typescript --project-id ooswtfgykyyatgasdgqz --schema public > src/types/supabase.ts`).
2.  **Modify `bookingStore.ts`:**
    *   Remove imports from `src/data/courses.ts`, `src/data/dates.ts`, `src/data/extras.ts`.
    *   Add import for the `supabase` client.
    *   Update `selectCourse`, `selectDate`, `addExtra`, `removeExtra` to fetch/manage data from Supabase (or keep local state for selection during the flow, but ensure data is fetched from Supabase initially).
    *   Rewrite `createBooking` to insert data into the `bookings` and `booking_extras` tables in Supabase. Get the authenticated user's ID from `useAuthStore`.
    *   Rewrite `getBookings` to query the `bookings` table in Supabase, potentially joining with `courses`, `course_dates`, and `booking_extras` to get full booking details. Filter by the authenticated user's ID.
3.  **Modify Components (`BookingFlow.tsx`, `Dashboard.tsx`, `AdminDashboard.tsx`):**
    *   Update components to use the modified `useBookingStore` functions that interact with Supabase.
    *   In `BookingFlow.tsx`, ensure available dates are fetched from the `course_dates` table based on the selected `course_id`.
    *   In `Dashboard.tsx`, fetch the user's bookings from Supabase using the updated `getBookings`. Implement the logic for the action buttons (Pay Deposit, Fill Info, Upload Docs, Pay in Full) to update the `bookings` table status and potentially interact with Supabase Storage for file uploads.
    *   In `AdminDashboard.tsx`, fetch user statuses and bookings from Supabase. Implement the status update checkboxes and the download files button (interacting with Supabase Storage). Update the "Schedule New Course Date" functionality to insert into the `course_dates` table.
4.  **Implement Row Level Security (RLS):** Define RLS policies in Supabase to ensure users can only view/manage their own bookings and admins have appropriate access.
5.  **Consider Backend Logic:** Evaluate if Supabase Functions or Database Triggers are needed for actions like automatically updating `current_participants` in `course_dates` when a booking is confirmed or handling payment webhook events.

## Phase 4: Testing

*   Thoroughly test the entire booking flow, from course selection to finalization on the dashboard, ensuring data is correctly persisted and retrieved from Supabase.
*   Test admin functionalities for managing users and scheduling dates.