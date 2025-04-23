import { create } from 'zustand';
import { Booking, BookingExtra, CourseDate, Course } from '../types';
import { courses } from '../data/courses';
import { courseDates } from '../data/dates';
import { supabase } from '../lib/supabase';

interface BookingState {
  bookings: Booking[];
  selectedCourse: Course | null;
  selectedDate: CourseDate | null;
  selectedExtras: BookingExtra[];
  isLoading: boolean;
  
  selectCourse: (courseId: string) => void;
  selectDate: (date: CourseDate | null) => void;
  addExtra: (extra: BookingExtra) => void;
  removeExtra: (extraId: string) => void;
  calculateTotal: () => number;
  createBooking: (userId: string) => Promise<string>;
  getBookings: () => Promise<Booking[]>;
  resetSelection: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedCourse: null,
  selectedDate: null,
  selectedExtras: [],
  isLoading: false,
  
  selectCourse: (courseId) => {
    const course = courses.find(c => c.id === courseId) || null;
    set({ selectedCourse: course, selectedDate: null });
  },
  
  selectDate: (date) => {
    set({ selectedDate: date });
  },
  
  addExtra: (extra) => {
    set(state => ({
      selectedExtras: [...state.selectedExtras, extra]
    }));
  },
  
  removeExtra: (extraId) => {
    set(state => ({
      selectedExtras: state.selectedExtras.filter(e => e.id !== extraId)
    }));
  },
  
  calculateTotal: () => {
    const { selectedCourse, selectedExtras } = get();
    if (!selectedCourse) return 0;
    
    const coursePrice = selectedCourse.price;
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    
    return coursePrice + extrasTotal;
  },
  
  createBooking: async (userId) => {
    const { selectedCourse, selectedDate, selectedExtras } = get();
    
    if (!selectedCourse || !selectedDate) {
      throw new Error('Course and date must be selected');
    }
    if (!userId) {
       throw new Error('User must be logged in to book');
    }
    
    set({ isLoading: true });
    let newBookingId = ''; // Variable to hold the ID of the created booking

    try {
      // 1. Prepare data for the 'bookings' table
      const bookingData = {
        user_id: userId,
        course_id: selectedCourse.id,
        course_date_id: selectedDate.id,
        status: 'pending', // Initial status
        payment_status: 'pending', // Initial payment status
        total_amount: get().calculateTotal(),
        forms_filled: false, // Default values
        files_uploaded: false,
        // created_at and updated_at usually handled by DB
      };

      // 2. Insert into 'bookings' table
      const { data: bookingInsertData, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select('id') // Select the ID of the newly created row
        .single(); // Expect only one row back

      if (bookingError) {
        console.error('Supabase booking insert error:', bookingError);
        throw new Error(bookingError.message || 'Failed to create booking record.');
      }

      if (!bookingInsertData || !bookingInsertData.id) {
        throw new Error('Failed to retrieve new booking ID after insert.');
      }

      newBookingId = bookingInsertData.id;
      console.log('Booking created with ID:', newBookingId);

      // 3. Prepare data for 'booking_extras' table (if any extras were selected)
      if (selectedExtras.length > 0) {
        const extrasData = selectedExtras.map(extra => ({
          booking_id: newBookingId,
          extra_id: extra.id,
          price_at_booking: extra.price // Record the price at the time of booking
          // created_at handled by DB
        }));

        // 4. Insert into 'booking_extras' table
        const { error: extrasError } = await supabase
          .from('booking_extras')
          .insert(extrasData);

        if (extrasError) {
          // Note: If this fails, the main booking is already created.
          // Consider how to handle this inconsistency (e.g., logging, manual cleanup, transaction?)
          console.error('Supabase booking_extras insert error:', extrasError);
          // Don't necessarily throw here, maybe just log, as the main booking succeeded.
          // You might want to inform the user or admin of the partial failure.
          // For now, we just log it.
        }
      }

      // 5. Booking and extras (if any) inserted successfully
      return newBookingId; // Return the ID of the created booking

    } catch (error) {
      // If an error occurred (especially during main booking insert),
      // re-throw it so the calling component can handle it.
      console.error('Error during booking process:', error);
      // Rollback or compensation logic could be added here if needed
      throw error; // Re-throw the caught error
    } finally {
      set({ isLoading: false });
    }
  },
  
  getBookings: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return get().bookings;
    } finally {
      set({ isLoading: false });
    }
  },
  
  resetSelection: () => {
    set({
      selectedCourse: null,
      selectedDate: null,
      selectedExtras: []
    });
  }
}));