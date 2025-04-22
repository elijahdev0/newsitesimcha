# Plan: Implement Admin-Managed Course Dates with Supabase

This plan details the steps to replace the static date generation with a dynamic system where administrators can manage available course dates via a UI, and these dates are stored in and fetched from Supabase.

**Phase 1: Backend Setup (Manual Supabase Steps)**

1.  **Create `course_dates` Table:**
    *   In your Supabase project's SQL Editor, create a new table to store course date availability.
    *   **SQL Schema:**
        ```sql
        CREATE TABLE public.course_dates (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          course_id TEXT NOT NULL, -- Consider FK to a courses table if one exists
          start_date TIMESTAMPTZ NOT NULL,
          end_date TIMESTAMPTZ NOT NULL,
          max_participants INT NOT NULL DEFAULT 10,
          current_participants INT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
          -- Add any other relevant fields (e.g., instructor_id, location_override)

          CONSTRAINT positive_participants CHECK (max_participants > 0 AND current_participants >= 0),
          CONSTRAINT valid_dates CHECK (end_date >= start_date)
          -- Add Foreign Key if you have a 'courses' table:
          -- CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
        );

        -- Optional: Indexes for performance
        CREATE INDEX idx_course_dates_course_id ON public.course_dates(course_id);
        CREATE INDEX idx_course_dates_start_date ON public.course_dates(start_date);
        ```
    *   *Note:* Adjust `course_id` type and foreign key based on your actual `courses` table structure if you have one.

2.  **Enable Row Level Security (RLS):**
    *   Navigate to the Authentication -> Policies section in Supabase for the `course_dates` table.
    *   Enable Row Level Security for the table.

3.  **Create RLS Policies:**
    *   **Policy 1: Allow Authenticated Users to Read Future Dates:**
        *   Name: `Allow authenticated read access to future dates`
        *   Target Roles: `authenticated`
        *   Operation: `SELECT`
        *   USING expression: `start_date >= now()`
    *   **Policy 2: Allow Admins Full Access:**
        *   Name: `Allow admin full access`
        *   Target Roles: `authenticated`
        *   Operation: `ALL` (SELECT, INSERT, UPDATE, DELETE)
        *   USING expression: `(SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'`
        *   WITH CHECK expression: `(SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'`
    *   *Note:* This assumes your public `users` table (queried in `authStore.ts`) has an `id` column matching `auth.uid()` and a `role` column containing `'admin'` for administrators. Adjust the policy check if your schema differs.

**Phase 2: Frontend Implementation (Code Changes)**

1.  **Create Admin Date Management Component (`src/pages/admin/ManageCourseDates.tsx`):**
    *   Create the new file.
    *   Implement a React component that:
        *   Gets `courseId` from URL params.
        *   Fetches dates for the specific course from `supabase.from('course_dates')`.
        *   Displays the fetched dates.
        *   Includes a form to add new dates (calling `supabase.from('course_dates').insert(...)`).
        *   Includes buttons/logic for updating and deleting existing dates (calling `update`/`delete`).
        *   Handles loading and error states.

2.  **Add Admin Route:**
    *   Ensure a route exists (likely in `src/App.tsx` or a router config file) for `/admin/courses/:id/dates`.
    *   Protect this route so only users with the 'admin' role can access it (using data from `useAuthStore`).

3.  **Refactor Booking Flow (`src/pages/booking/BookingFlow.tsx`):**
    *   Modify the `useEffect` hook that currently filters `courseDates`.
    *   Replace the static data filtering with an async call to `supabase.from('course_dates').select('*').eq('course_id', courseId).gte('start_date', new Date().toISOString())`.
    *   Update the `setAvailableDates` state with the fetched data.
    *   Handle loading/error states for the fetch operation.

4.  **Refactor Booking Store (`src/store/bookingStore.ts`):**
    *   Update the `selectDate` function. Since dates are now fetched dynamically in `BookingFlow`, ensure it correctly receives and stores the selected `CourseDate` object (fetched from Supabase) rather than relying on looking up an ID in the static array. The current implementation using `find` on `courseDates` **must** be removed or adapted. *Initial Focus: Ensure `BookingFlow` passes the correct data.*
    *   Remove the `courseDates` import.

5.  **Remove Static Data (`src/data/dates.ts`):**
    *   Delete the `src/data/dates.ts` file.
    *   Remove imports of `courseDates` from all files that use it (e.g., `BookingFlow.tsx`, `bookingStore.ts`, `AdminDashboard.tsx`). 