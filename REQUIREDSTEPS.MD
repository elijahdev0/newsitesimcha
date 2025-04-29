# Project Pages Overview

Below is a list of all the main pages in this project, grouped by their directory:

## Root Pages (`src/pages`)
- Home.tsx
- About.tsx
- Courses.tsx
- Register.tsx
- Login.tsx
- Terms.tsx
- Privacy.tsx

## Admin Pages (`src/pages/admin`)
- AdminDashboard.tsx
- ManageCourseDates.tsx

## Dashboard Pages (`src/pages/dashboard`)
- Dashboard.tsx

## Booking Pages (`src/pages/booking`)
- BookingFlow.tsx

## Contact Pages (`src/pages/contact`)
- Contact.tsx

## Calendar System Overview

### In Admin: ManageCourseDates
- Admins can add, edit, and delete course date slots for each course.
- Each date slot has a start date/time, end date/time, and a maximum number of participants.
- Dates are managed via a table view, with options to view participants, edit, or delete each slot.
- Adding or editing a date opens a modal with a form to select the start/end date and set the max participants.
- The system prevents deletion of dates that have existing bookings, prompting the admin to view participants instead.
- All date data is stored in the `course_dates` table in the database, and participant counts are shown for each slot.

### In BookingFlow (User Side)
- Users select a course and proceed to the scheduling step.
- The available dates for the selected course are fetched from the backend, only showing dates that are not full.
- A calendar UI (using `react-datepicker`) displays available dates, highlighting those with open slots.
- Users can click a date to view details (start/end time, location, availability, etc.) and select it for booking.
- The system ensures users cannot select dates that are already full.
- When a date is selected, the booking flow continues to confirmation and payment.

This calendar system ensures that course scheduling is managed efficiently by admins and that users can only book valid, available dates.

## Booking Flow & User Dashboard Overview

### Booking Flow (User Journey)
1. **Select a Course**
   - Users browse available courses and select the one they wish to book.
2. **Pick a Date**
   - After selecting a course, users proceed to the scheduling step.
   - A calendar displays available dates for the chosen course (dates with open slots only).
   - Users select a date to view details (start/end time, location, availability) and confirm their choice.
3. **Complete Booking**
   - Users confirm their package and selected date, then submit the booking.
   - After booking, users are redirected to a confirmation page with next steps and a summary.
   - The booking is provisional until all required steps are completed in the dashboard.

### User Dashboard (Post-Booking Steps)
After booking, users must complete several steps to confirm and finalize their reservation:

1. **Pay Deposit**
   - A deposit payment (typically €1000) is required to reserve the spot.
   - Users initiate payment via Stripe from their dashboard. The system tracks payment status (pending, deposit paid, paid in full).
2. **Fill Information Form**
   - Users must complete a detailed form with personal, emergency contact, and medical information, as well as agree to terms and sign electronically.
3. **Upload Documents**
   - Users are required to upload a criminal background check document (PDF, JPG, PNG, DOC(X), max 10MB).
   - The upload is handled securely and tracked in the booking status.
4. **Pay Remaining Balance**
   - If only the deposit is paid, users can pay the remaining balance via Stripe before the course starts.
5. **Schedule Introductory Meeting**
   - Users are prompted to schedule a mandatory meeting with the instructor (via Calendly link) after completing all required steps.

#### Status & Progress
- The dashboard displays the status of each step (e.g., paid, pending, completed, action required).
- Users see clear action buttons for each incomplete step (e.g., "Pay Deposit", "Fill Form", "Upload Doc").
- Only after all steps are completed and payment is made in full is the booking fully confirmed.

This system ensures a structured, step-by-step process for users to secure their spot, provide all necessary information, and meet all requirements for participation.

## Supabase Integration

### Database Schema Overview

The application uses Supabase for data storage and authentication, with the following main tables:

#### Authentication Tables
- `auth.users`: Handles core user authentication data
  - Stores email, password (encrypted), and authentication status
  - Manages email confirmation and recovery tokens
  - Tracks user roles and metadata

#### Core Application Tables

1. **Users Table** (`public.users`)
   - Basic user information (first_name, last_name, email)
   - Role-based access control
   - Links to auth.users through id

2. **Courses Table** (`public.courses`)
   - Course information (title, description, duration)
   - Base pricing for courses
   - Created timestamp tracking

3. **Course Dates Table** (`public.course_dates`)
   - Links to courses through course_id
   - Tracks start_date and end_date
   - Manages participant limits (max_participants, current_participants)
   - Used in both admin dashboard for management and booking flow for availability

4. **Bookings Table** (`public.bookings`)
   - Core booking information
   - Links to courses and course_dates
   - Tracks payment_status and booking status
   - Manages document uploads and form completion status
   - Total amount calculation including extras

5. **Booking Details Table** (`public.booking_details`)
   - Detailed participant information
   - Emergency contact information
   - Medical and dietary information
   - Signature and consent tracking

6. **Extras Table** (`public.extras`)
   - Additional items/services that can be added to bookings
   - Categorized extras with individual pricing
   - Description and metadata

7. **Booking Extras Table** (`public.booking_extras`)
   - Junction table linking bookings with selected extras
   - Tracks price at time of booking
   - Allows for multiple extras per booking

### Integration Points

1. **Authentication Flow**
   - User signup/login handled through Supabase Auth
   - Role-based access control for admin/user areas
   - Session management and token handling

2. **Booking Flow**
   - Course selection pulls from courses table
   - Available dates filtered through course_dates
   - Extras selection from extras table
   - Booking creation spans multiple tables:
     1. Creates booking record
     2. Links selected extras
     3. Stores participant details
     4. Updates course date participant count

3. **Admin Dashboard**
   - Course management (CRUD operations)
   - Date management with participant tracking
   - Booking overview with detailed participant information
   - Extra item management

4. **User Dashboard**
   - Personal booking history
   - Document upload tracking
   - Form completion status
   - Payment status monitoring

### Storage Integration

The application also uses Supabase Storage for:
- Document uploads
- User-submitted forms
- Course materials
- Organized in buckets with proper access control

### Real-time Features
Supabase's real-time capabilities are used for:
- Updating available spots in courses
- Reflecting booking status changes
- Syncing admin dashboard data

---

Let me know the next steps you want to include in this overview or any other details to add.
