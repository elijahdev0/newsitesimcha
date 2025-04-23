import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Check, ChevronRight, Package, Calendar, CheckCircle, Info } from 'lucide-react'; // Added CheckCircle/Info for confirmation step
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { formatCurrency } from '../../utils/formatters';
import { extras } from '../../data/courses';
import { CourseDate, Extra, BookingExtra } from '../../types';

// Interface for Course data fetched from Supabase (removed slug)
interface SupabaseCourse {
  id: string; // UUID
  title: string;
  price: number;
  duration: number;
  rounds: number; // Added rounds based on usage
  hotel: string | null;
  transport: string | null;
  description: string | null;
  includes: string[]; // Assuming JSON stored as string array
  // slug: string; // Removed slug
  // Add other relevant fields: isPopular, kosherAvailable, etc.
}

// Supabase types for course_dates
interface SupabaseCourseDate {
  id: string;
  course_id: string; // This should be the UUID from SupabaseCourse.id
  start_date: string;
  end_date: string;
  max_participants: number;
  current_participants: number;
  created_at: string;
}

const BookingFlow: React.FC = () => {
  const navigate = useNavigate();
  // Use courseId directly from URL params, assuming it's the UUID
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const { selectCourse, selectedCourse, selectDate, selectedDate, addExtra, removeExtra, selectedExtras, calculateTotal, createBooking, resetSelection } = useBookingStore();
  
  const [step, setStep] = useState(1);
  const [availableDates, setAvailableDates] = useState<SupabaseCourseDate[]>([]);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter extras by category for better organization
  const experienceExtras = extras.filter(extra => extra.category === 'experience');
  const tacticalExtras = extras.filter(extra => extra.category === 'tactical');
  const accommodationExtras = extras.filter(extra => extra.category === 'accommodation');
  const mediaExtras = extras.filter(extra => extra.category === 'media');
  
  // Check if an extra is selected
  const isExtraSelected = (extraId: string): boolean => {
    return selectedExtras.some(e => e.id === extraId);
  };
  
  // Toggle extra selection
  const toggleExtra = (extra: Extra) => {
    if (isExtraSelected(extra.id)) {
      removeExtra(extra.id);
    } else {
      addExtra(extra as BookingExtra);
    }
  };
  
  // Navigate to next step
  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };
  
  // Complete booking
  const completeBooking = async () => {
    if (!selectedDate) {
      setError("Please select a date before completing the booking.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (!user?.id) {
        throw new Error("User not found. Cannot create booking.");
      }
      const bookingId = await createBooking(user.id); // Pass user.id
      console.log("Booking successfully created with ID:", bookingId); // Optional log
      setIsBookingComplete(true);
      setStep(3); // Set step to 3 (Confirmation) after booking
    } catch (error: any) {
      console.error('Booking failed:', error);
      setError(`Booking failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDateStr = (date: Date): string => {
    return format(date, 'MMM d, yyyy');
  };

  // Format date and time for display
  const formatDateTimeStr = (date: Date): string => {
    return format(date, 'MMM d, yyyy HH:mm'); // e.g., Apr 23, 2024 14:30
  };
  
  // Handle date selection from calendar
  const handleDateSelection = (date: Date) => {
    setSelectedDateObj(date);
    setError(null); // Clear error when selecting a date

    console.log("Calendar clicked date:", date);

    // Find the corresponding date record more robustly
    const selectedCourseDate = availableDates.find(d => {
      const startDate = new Date(d.start_date);
      // Compare year, month, and day individually
      return (
        startDate.getFullYear() === date.getFullYear() &&
        startDate.getMonth() === date.getMonth() &&
        startDate.getDate() === date.getDate()
      );
    });

    if (selectedCourseDate) {
      console.log("Found matching available date:", selectedCourseDate);

      // Map the Supabase object (snake_case) to the store's expected type (camelCase)
      // Ensure the 'CourseDate' type is correctly defined in src/types/index.ts
      const storeReadyDate: CourseDate = {
        id: selectedCourseDate.id,
        courseId: selectedCourseDate.course_id,
        startDate: selectedCourseDate.start_date,
        endDate: selectedCourseDate.end_date,
        maxParticipants: selectedCourseDate.max_participants,
        currentParticipants: selectedCourseDate.current_participants,
        // Add/map other fields if your CourseDate type requires them
      };
      // Pass the correctly typed object to the store
      selectDate(storeReadyDate);

    } else {
      // If the selected calendar date doesn't match an available slot,
      // don't update the store's selectedDate.
      console.warn("Clicked date could not be matched in availableDates:", date, availableDates);
      // Optionally ensure the store knows no date is selected:
      selectDate(null); // Pass null to the store if no match is found
    }
  };
  
  // Fetch dates from Supabase
  const fetchDates = useCallback(async (courseUuid: string) => {
    if (!courseUuid) return;
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching dates for course UUID: ${courseUuid}`); // Debug log
      const { data, error: fetchError } = await supabase
        .from('course_dates')
        .select('*')
        .eq('course_id', courseUuid)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (fetchError) {
        console.error('Supabase fetchDates error:', fetchError); // Log the specific error
        throw fetchError;
      }

      const available = (data as SupabaseCourseDate[]).filter(
        d => d.current_participants < d.max_participants
      );

      console.log('Available dates fetched:', available); // Debug log
      setAvailableDates(available || []);
    } catch (err: any) {
      console.error('Error in fetchDates function:', err); // Log the error
      setError(`Failed to fetch available dates: ${err.message}.`);
      setAvailableDates([]); // Clear dates on error
    } finally {
      // Loading state is handled by the initial fetch function
      setIsLoading(false);
    }
  }, []);
  
  // Initialize booking with selected course
  useEffect(() => {
    if (!isAuthenticated) {
      // Pass the courseId in the redirect state
      navigate('/register', { state: { redirectTo: `/book/${courseId}` } });
      return;
    }
    
    resetSelection();
    
    // Use courseId (UUID) directly
    if (courseId) {
      setIsLoading(true);
      setError(null);
      setAvailableDates([]); // Clear previous dates

      const fetchCourseAndDates = async () => {
        if (!courseId) {
          setError('Course identifier missing from URL.');
          setIsLoading(false);
          return;
        }

        try {
          console.log(`Fetching course with ID: ${courseId}`); // Debug log
          // Fetch the course using the ID from the URL
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('*') // Select all columns
            .eq('id', courseId) // Match the ID (UUID)
            .single(); // Expect only one course

          if (courseError) {
            console.error('Supabase fetchCourse error:', courseError);
            // Handle potential 'PGRST116' error if no rows found
            if (courseError.code === 'PGRST116') {
              throw new Error(`Course with ID '${courseId}' not found.`);
            }
            throw new Error(`Database error fetching course: ${courseError.message}`);
          }

          if (!courseData) {
            // This case might be redundant if .single() throws PGRST116, but good for safety
            throw new Error(`Course with ID '${courseId}' not found.`);
          }

          const fetchedCourse = courseData as SupabaseCourse;
          console.log('Fetched course:', fetchedCourse); // Debug log

          // Set the selected course in the store using the ID
          // Pass the course ID string to the store
          selectCourse(fetchedCourse.id);

          // Now fetch dates using the ID of the fetched course
          await fetchDates(fetchedCourse.id);

        } catch (err: any) {
          console.error('Error fetching course or dates:', err); // Log the error
          setError(err.message || 'An unexpected error occurred while loading course data.');
          // Pass an empty string to indicate no course selected on error
          selectCourse('');
        } finally {
          setIsLoading(false); // Stop loading after course and dates are fetched (or failed)
        }
      };

      fetchCourseAndDates();

      // Cleanup function
      return () => {
        resetSelection();
      };
    }
  }, [courseId, isAuthenticated, navigate, resetSelection, selectCourse, fetchDates]); // Use courseId in dependency array

  // Load Calendly script - Ideally, this should be in index.html or loaded globally
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script when component unmounts
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);
  
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-700 mx-auto"></div>
            <p className="mt-4">Loading course details and dates...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (error && !selectedCourse) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-3xl mx-auto" role="alert">
              <strong className="font-bold mr-2">Error!</strong>
              <span className="block sm:inline">{error}</span>
              <p className="mt-2 text-sm">Please check the course identifier in the URL or try again later.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!selectedCourse) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <p>Could not load course details. Please try again.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex justify-between">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-accent-600' : 'text-tactical-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-accent-600 text-white' : 'bg-tactical-200 text-tactical-600'}`}>
                  {step > 1 ? <Check className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <span className="text-sm mt-2">Package</span>
              </div>
              
              <div className="flex-1 flex items-center">
                <div className={`flex-1 h-1 ${step >= 2 ? 'bg-accent-500' : 'bg-tactical-200'}`}></div>
              </div>
              
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-accent-600' : 'text-tactical-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-accent-600 text-white' : 'bg-tactical-200 text-tactical-600'}`}>
                  {step > 2 ? <Check className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                </div>
                <span className="text-sm mt-2">Schedule</span>
              </div>

              <div className="flex-1 flex items-center">
                <div className={`flex-1 h-1 ${step >= 3 ? 'bg-accent-500' : 'bg-tactical-200'}`}></div>
              </div>

              <div className={`flex flex-col items-center ${step >= 3 ? 'text-accent-600' : 'text-tactical-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-accent-600 text-white' : 'bg-tactical-200 text-tactical-600'}`}>
                  {/* Use CheckCircle for confirmation, Check when done */}
                  {step > 3 ? <Check className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </div>
                <span className="text-sm mt-2">Confirmation</span> {/* Added Confirmation step text */}
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Step 1: Course Details */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="font-heading text-2xl font-bold text-tactical-900 mb-8">
                  1. Review Your Selected Package
                </h1>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex-1 border border-gray-200 rounded-lg p-6">
                    <h2 className="font-heading text-xl font-semibold text-tactical-900 mb-4">
                      {selectedCourse.title}
                    </h2>
                    <div className="text-2xl font-bold text-tactical-900 mb-4">
                      {formatCurrency(selectedCourse.price)}
                    </div>
                    <p className="text-tactical-700 mb-4">
                      {selectedCourse.description || 'No description available.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
                        {selectedCourse.duration} days
                      </span>
                      {typeof selectedCourse.rounds === 'number' && (
                        <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
                          {selectedCourse.rounds} rounds
                        </span>
                      )}
                      {selectedCourse.hotel && (
                        <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
                          Accommodation
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {(selectedCourse.includes || []).map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-accent-500 mr-2 font-bold">✓</span>
                          <span className="text-sm text-tactical-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-tactical-900 mb-4">Add Optional Extras</h3>
                    
                    {/* Experience Extras */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-tactical-700 mb-2">Experiences</h4>
                      <div className="space-y-2">
                        {experienceExtras.map(extra => (
                          <div 
                            key={extra.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              isExtraSelected(extra.id) 
                                ? 'border-accent-500 bg-accent-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleExtra(extra)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-tactical-800">{extra.name}</span>
                                <p className="text-xs text-tactical-600">{extra.description}</p>
                              </div>
                              <span className="font-semibold text-tactical-900">
                                {formatCurrency(extra.price)}
                              </span>
                            </div>
                            <button
                              className={`absolute top-2 right-2 p-1 rounded-full text-xs ${
                                isExtraSelected(extra.id) ? 'bg-accent-600 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExtra(extra as BookingExtra);
                              }}
                            >
                              {isExtraSelected(extra.id) ? 'Remove' : 'Add'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tactical Extras */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-tactical-700 mb-2">Tactical Add-ons</h4>
                      <div className="space-y-2">
                        {tacticalExtras.map(extra => (
                          <div 
                            key={extra.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              isExtraSelected(extra.id) 
                                ? 'border-accent-500 bg-accent-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleExtra(extra)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-tactical-800">{extra.name}</span>
                                <p className="text-xs text-tactical-600">{extra.description}</p>
                              </div>
                              <span className="font-semibold text-tactical-900">
                                {formatCurrency(extra.price)}
                              </span>
                            </div>
                            <button
                              className={`absolute top-2 right-2 p-1 rounded-full text-xs ${
                                isExtraSelected(extra.id) ? 'bg-accent-600 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExtra(extra as BookingExtra);
                              }}
                            >
                              {isExtraSelected(extra.id) ? 'Remove' : 'Add'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Media Extras */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-tactical-700 mb-2">Media & Merchandise</h4>
                      <div className="space-y-2">
                        {mediaExtras.map(extra => (
                          <div 
                            key={extra.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              isExtraSelected(extra.id) 
                                ? 'border-accent-500 bg-accent-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleExtra(extra)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-tactical-800">{extra.name}</span>
                                <p className="text-xs text-tactical-600">{extra.description}</p>
                              </div>
                              <span className="font-semibold text-tactical-900">
                                {formatCurrency(extra.price)}
                              </span>
                            </div>
                            <button
                              className={`absolute top-2 right-2 p-1 rounded-full text-xs ${
                                isExtraSelected(extra.id) ? 'bg-accent-600 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExtra(extra as BookingExtra);
                              }}
                            >
                              {isExtraSelected(extra.id) ? 'Remove' : 'Add'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-tactical-700">Package Price:</span>
                      <p className="text-lg font-semibold text-tactical-900">
                        {formatCurrency(selectedCourse.price)}
                      </p>
                    </div>
                    
                    {selectedExtras.length > 0 && (
                      <div>
                        <span className="text-tactical-700">Selected Extras:</span>
                        <p className="text-lg font-semibold text-tactical-900">
                          {formatCurrency(selectedExtras.reduce((sum, extra) => sum + extra.price, 0))}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-tactical-700">Total:</span>
                      <p className="text-xl font-bold text-tactical-900">
                        {formatCurrency(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    variant="primary"
                    onClick={nextStep}
                  >
                    Continue to Schedule
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Date Selection */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="font-heading text-2xl font-bold text-tactical-900 mb-8">
                  2. Select Training Dates
                </h1>
                {error && !isLoading && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold mr-2">Error!</strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                {isLoading && !availableDates.length && (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tactical-700 mx-auto mb-3"></div>
                    <p>Loading Available Dates...</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-tactical-900 mb-4">Available Dates</h3>
                    {!isLoading && availableDates.length === 0 && !error && (
                      <div className="bg-tactical-50 p-4 rounded-lg text-center text-tactical-600">
                        <Calendar className="w-10 h-10 mx-auto mb-2 text-tactical-400" />
                        No available dates found for this course at the moment.
                      </div>
                    )}
                    {availableDates.length > 0 && (
                      <div className="bg-tactical-50 p-4 rounded-lg">
                        <DatePicker
                          selected={selectedDateObj}
                          onChange={handleDateSelection}
                          includeDates={availableDates.map(date => new Date(date.start_date))}
                          inline
                          minDate={new Date()}
                          className="w-full border rounded-md p-2"
                          highlightDates={availableDates.map(date => new Date(date.start_date))}
                        />
                      </div>
                    )}
                    <p className="text-sm text-tactical-600 mt-4">
                      * Highlighted dates indicate available training slots. Select a date to view details.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-tactical-900 mb-4">Training Details</h3>
                    {selectedDate && (() => {
                      const fullSelectedDate = availableDates.find(d => d.id === selectedDate.id);
                      if (!fullSelectedDate) {
                        return (
                          <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center h-64">
                            <Info className="w-12 h-12 text-orange-400 mb-4" />
                            <p className="text-tactical-700 text-center">
                              Selected date details not found. Please select another date.
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div className="border border-gray-200 rounded-lg p-6">
                          <div className="mb-4">
                            <h4 className="font-semibold text-tactical-900">Selected Date:</h4>
                            <p className="text-tactical-700">
                              {/* Use formatDateTimeStr for full details */}
                              Starts: {formatDateTimeStr(new Date(fullSelectedDate.start_date))}
                            </p>
                            <p className="text-tactical-700">
                              Ends:   {formatDateTimeStr(new Date(fullSelectedDate.end_date))}
                            </p>
                            <p className="text-sm text-tactical-600 mt-1">
                              Duration: {selectedCourse.duration} days
                            </p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-semibold text-tactical-900">Location:</h4>
                            <p className="text-tactical-700">S-Arms Shooting Range, Tallinn, Estonia</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-semibold text-tactical-900">Availability:</h4>
                            <p className="text-tactical-700">
                              {fullSelectedDate.max_participants - fullSelectedDate.current_participants} spots available
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div 
                                className="bg-accent-600 h-2.5 rounded-full" 
                                style={{ width: `${(fullSelectedDate.current_participants / fullSelectedDate.max_participants) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {selectedCourse.hotel && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-tactical-900">Accommodation:</h4>
                              <p className="text-tactical-700">{selectedCourse.hotel}</p>
                            </div>
                          )}
                          
                          {selectedCourse.transport && (
                            <div>
                              <h4 className="font-semibold text-tactical-900">Transport:</h4>
                              <p className="text-tactical-700">{selectedCourse.transport}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {!selectedDate && (
                      <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center h-64">
                        <Calendar className="w-12 h-12 text-tactical-400 mb-4" />
                        <p className="text-tactical-700 text-center">
                          Please select an available date from the calendar to view training details.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                  >
                    Back to Package
                  </Button>
                  <Button
                    variant="primary"
                    onClick={completeBooking}
                    disabled={!selectedDate || isLoading || !!error || !availableDates.length}
                    isLoading={!!(isLoading && step === 2)}
                  >
                    Complete Booking
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Confirmation & Next Steps */}
            {step === 3 && isBookingComplete && (() => {
              const fullSelectedDate = availableDates.find(d => d.id === selectedDate?.id);

              return (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Info className="w-10 h-10 text-blue-600" />
                  </div>
                  <h1 className="font-heading text-2xl font-bold text-tactical-900 mb-4">
                    Booking Received - Action Required!
                  </h1>
                  <p className="text-tactical-700 mb-6 max-w-xl mx-auto">
                    Thank you! We've received your booking request for {selectedCourse?.title || 'the selected course'}.
                    <strong className="text-accent-700"> Your place is NOT reserved yet.</strong>
                    To confirm your spot, please complete the following steps in your dashboard:
                  </p>
                  <ul className="list-disc list-inside text-left max-w-md mx-auto mb-8 text-tactical-700 space-y-2">
                    <li>Submit the <strong className="font-semibold">€1000 deposit</strong>.</li>
                    <li>Complete your <strong className="font-semibold">User Details Form</strong>.</li>
                    <li>Upload required <strong className="font-semibold">Documents</strong>.</li>
                  </ul>

                  <p className="text-tactical-700 mb-8 max-w-xl mx-auto">
                    Additionally, please schedule a mandatory introductory meeting with your instructor using the link below.
                  </p>
                  
                  <div className="mb-8">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        (window as any).Calendly.initPopupWidget({url: 'https://calendly.com/rosh-en-ab-d-ulla-h27'});
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                    >
                      Schedule Instructor Meeting (Required)
                    </a>
                  </div>

                  <div className="bg-tactical-50 p-6 rounded-lg max-w-md mx-auto mb-8 border border-tactical-200">
                    <h3 className="font-semibold text-tactical-900 mb-4">Provisional Booking Summary</h3>
                    <div className="flex justify-between mb-2">
                      <span className="text-tactical-700">Package:</span>
                      <span className="font-medium">{selectedCourse?.title || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-tactical-700">Dates:</span>
                      <span className="font-medium">
                        {fullSelectedDate ? `${formatDateStr(new Date(fullSelectedDate.start_date))} to ${formatDateStr(new Date(fullSelectedDate.end_date))}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-tactical-700">Location:</span>
                      <span className="font-medium">S-Arms Shooting Range, Tallinn</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tactical-700">Total Amount Due:</span>
                      <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                    </div>
                     <p className="text-xs text-tactical-600 mt-3">*Deposit of €1000 required to confirm.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/dashboard')}
                    >
                      Go to Dashboard to Complete Booking
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookingFlow;