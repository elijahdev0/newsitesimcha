import { create } from 'zustand';
import { Booking, BookingExtra, CourseDate, Course } from '../types';
import { courses } from '../data/courses';
import { courseDates } from '../data/dates';

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
  createBooking: () => Promise<Booking>;
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
  
  createBooking: async () => {
    const { selectedCourse, selectedDate, selectedExtras } = get();
    
    if (!selectedCourse || !selectedDate) {
      throw new Error('Course and date must be selected');
    }
    
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const booking: Booking = {
        id: `booking-${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current-user', // This would normally come from the auth context
        courseId: selectedCourse.id,
        courseDateId: selectedDate.id,
        status: 'pending',
        paymentStatus: 'pending',
        totalAmount: get().calculateTotal(),
        createdAt: new Date().toISOString(),
        extras: selectedExtras
      };
      
      set(state => ({
        bookings: [...state.bookings, booking]
      }));
      
      return booking;
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