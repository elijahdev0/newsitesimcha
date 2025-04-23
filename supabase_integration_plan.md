Confirm with me that this is correct by reading each file relevent and prove it to me "The booking process in this project is implemented as a multi-step flow in BookingFlow.tsx:

1. **Step 1: Review Package**
   - The user reviews the selected course/package details, including price, description, and included features.
   - The user can add optional extras (experiences, tactical add-ons, accommodation, media/merchandise) to their booking.

2. **Step 2: Select Training Dates**
   - The user selects an available training date from a calendar (`DatePicker`).
   - Available dates are filtered by course and shown inline.
   - When a date is selected, details (duration, location, availability) are displayed.

3. **Step 3: Payment**
   - The user sees a booking summary (course, dates, extras, total price).
   - Important information (deposit, cancellation, payment policy) is shown.
   - The user enters payment details (card name, number, expiry, CVC) and submits the form.

4. **Step 4: Confirmation**
   - After successful booking, a confirmation message and summary are displayed.
   - The user can go to their dashboard or print a receipt.

**State Management:**
- The process uses a Zustand store (`src/store/bookingStore.ts`) to manage:
  - Selected course, date, and extras
  - Booking creation and loading state
  - Total calculation

**Key Functions:**
- `selectCourse(courseId)`: Sets the selected course.
- `selectDate(dateId)`: Sets the selected date.
- `addExtra(extra)` / `removeExtra(extraId)`: Manage selected extras.
- `calculateTotal()`: Computes the total price.
- `createBooking()`: Simulates booking creation (would be replaced by an API call in production).

**Data Flow:**
- Course and date selection update the store.
- Extras are toggled and reflected in the summary.
- On payment, the booking is created and the user is shown a confirmation.

**Note:** According to PLAN.md, there are plans to refactor date fetching to use Supabase instead of static data.

You can see the main logic and UI for each step in `BookingFlow.tsx`."