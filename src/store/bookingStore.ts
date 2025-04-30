import { create } from 'zustand';
import { Booking, BookingExtra, CourseDate, Course } from '../types';
import { courses } from '../data/courses';
import { supabase } from '../lib/supabase';

// Define the structure for selected extras with quantity
interface SelectedExtraItem {
  extra: BookingExtra;
  quantity: number;
}

interface BookingState {
  bookings: Booking[];
  selectedCourse: Course | null;
  selectedDate: CourseDate | null;
  selectedExtras: SelectedExtraItem[]; // Updated structure
  isLoading: boolean;
  
  selectCourse: (courseId: string) => void;
  selectDate: (date: CourseDate | null) => void;
  // Updated function signatures for quantity
  increaseQuantity: (extra: BookingExtra) => void;
  decreaseQuantity: (extraId: string) => void;
  getExtraQuantity: (extraId: string) => number; // Helper to get quantity
  calculateTotal: () => number;
  createBooking: (userId: string) => Promise<string>;
  getBookings: () => Promise<Booking[]>;
  resetSelection: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedCourse: null,
  selectedDate: null,
  selectedExtras: [], // Initialize with new structure
  isLoading: false,
  
  selectCourse: (courseId) => {
    const course = courses.find(c => c.id === courseId) || null;
    set({ selectedCourse: course, selectedDate: null });
  },
  
  selectDate: (date) => {
    set({ selectedDate: date });
  },
  
  // Renamed addExtra to increaseQuantity and updated logic
  increaseQuantity: (extra) => {
    set(state => {
      const existingIndex = state.selectedExtras.findIndex(item => item.extra.id === extra.id);
      if (existingIndex > -1) {
        // Extra exists, increment quantity
        const updatedExtras = [...state.selectedExtras];
        updatedExtras[existingIndex] = {
          ...updatedExtras[existingIndex],
          quantity: updatedExtras[existingIndex].quantity + 1
        };
        return { selectedExtras: updatedExtras };
      } else {
        // Extra doesn't exist, add with quantity 1
        return { selectedExtras: [...state.selectedExtras, { extra, quantity: 1 }] };
      }
    });
  },
  
  // Renamed removeExtra to decreaseQuantity and updated logic
  decreaseQuantity: (extraId) => {
    set(state => {
      const existingIndex = state.selectedExtras.findIndex(item => item.extra.id === extraId);
      if (existingIndex > -1) {
        const currentQuantity = state.selectedExtras[existingIndex].quantity;
        if (currentQuantity > 1) {
          // Quantity > 1, decrement
          const updatedExtras = [...state.selectedExtras];
          updatedExtras[existingIndex] = {
            ...updatedExtras[existingIndex],
            quantity: currentQuantity - 1
          };
          return { selectedExtras: updatedExtras };
        } else {
          // Quantity is 1, remove the item
          return { 
            selectedExtras: state.selectedExtras.filter(item => item.extra.id !== extraId) 
          };
        }
      } 
      // If extra not found (shouldn't happen with correct UI), do nothing
      return {}; 
    });
  },

  // Helper function to get the quantity of a specific extra
  getExtraQuantity: (extraId) => {
    const { selectedExtras } = get();
    const item = selectedExtras.find(item => item.extra.id === extraId);
    return item ? item.quantity : 0;
  },
  
  calculateTotal: () => {
    const { selectedCourse, selectedExtras } = get();
    if (!selectedCourse) return 0;
    
    const coursePrice = selectedCourse.price;
    // Update calculation to include quantity
    const extrasTotal = selectedExtras.reduce((sum, item) => sum + (item.extra.price * item.quantity), 0);
    
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
        // Expand the extras based on quantity for insertion
        const extrasData = selectedExtras.flatMap(item => 
          Array.from({ length: item.quantity }, () => ({
            booking_id: newBookingId,
            extra_id: item.extra.id,
            price_at_booking: item.extra.price // Record the price at the time of booking
            // created_at handled by DB
          }))
        );

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
      selectedExtras: [] // Reset with empty array
    });
  }
}));