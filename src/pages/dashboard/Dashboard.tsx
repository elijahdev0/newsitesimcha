import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  Plus,
  Users,
  Upload,
  FileText,
  CreditCard,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Booking, Course } from '../../types';
import { courses } from '../../data/courses';
import { Modal } from '../../components/common/Modal';
import Courses from '../Courses';
import { BookingInformationForm } from '../../components/dashboard/BookingInformationForm';
import { UploadDocumentForm } from '../../components/dashboard/UploadDocumentForm';
import { supabase } from '../../lib/supabase';

// Use generated types for Supabase data
import { Tables, TablesInsert } from '../../../supabase/schema_types';
type SupabaseBooking = Tables<'bookings'>;
// Define a more specific type for the component's booking state, including optional fields
interface DashboardBooking extends Booking {
  formsFilled?: boolean; // Make optional as it comes from DB
  filesUploaded?: boolean; // Make optional as it comes from DB
  documentPath?: string | null; // Add field for document path
}
type BookingDetailsInsert = TablesInsert<'booking_details'>;

// Define a type for the form data structure expected by handleInformationFormSubmit
// This improves type safety compared to 'any'
interface BookingFormData {
  bookingId: string;
  personal: {
    firstName: string;
    lastName: string;
    birthday: string;
    country: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medical: {
    hasConditions: boolean | null;
    conditionsDetails: string;
    takesMedications: boolean | null;
    medicationsDetails: string;
    hasDietaryRestrictions: boolean | null;
    dietaryRestrictionsDetails: string;
  };
  signature: {
    name: string;
    date: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isInfoFormModalOpen, setIsInfoFormModalOpen] = useState(false);
  const [selectedBookingIdForForm, setSelectedBookingIdForForm] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBookingIdForUpload, setSelectedBookingIdForUpload] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- New state for Stripe flow ---
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState<string | null>(null); // Store bookingId being processed
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Load Calendly script
  useEffect(() => {
    const scriptId = 'calendly-widget-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch user bookings function, wrapped in useCallback
  const fetchUserBookings = useCallback(async () => {
    if (!user?.id) return; // Guard clause if user id is not available

    setIsLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*') // Select all columns
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch bookings error:', error);
        throw error;
      }

      // Map Supabase data (snake_case) to component state type (camelCase)
      const formattedBookings: DashboardBooking[] = (data || []).map((dbBooking: SupabaseBooking) => ({
        id: dbBooking.id,
        userId: dbBooking.user_id,
        courseId: dbBooking.course_id,
        courseDateId: dbBooking.course_date_id,
        status: dbBooking.status as Booking['status'],
        paymentStatus: dbBooking.payment_status as Booking['paymentStatus'],
        totalAmount: dbBooking.total_amount,
        createdAt: dbBooking.created_at,
        extras: [], // Extras are not directly fetched here, initialize as empty
        formsFilled: dbBooking.forms_filled, // Read actual value
        filesUploaded: dbBooking.files_uploaded, // Read actual value
        documentPath: dbBooking.document_path, // Read document path
      }));

      setBookings(formattedBookings);

    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  // Add user.id to dependency array
  }, [user?.id]);

  // Effect to fetch bookings when auth state changes or user ID becomes available
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        fetchUserBookings(); // Call the memoized fetch function
      }
    }
  // Update dependencies
  }, [isAuthLoading, isAuthenticated, user?.id, navigate, fetchUserBookings]);

  const getCourseById = (courseId: string): Course | undefined => {
    // Assuming 'courses' is static data from '../../data/courses'
    // If courses were dynamic, they'd need fetching too.
    // This finds the course details based on the courseId stored in the booking.
    // TODO: Ensure the Course type in types/index.ts matches the data structure in data/courses.ts
    return courses.find(course => course.id === courseId);
  };

  const showOverallLoading = isAuthLoading || isLoadingBookings;

  // --- Modal Handlers ---
  const openInfoFormModal = (bookingId: string) => {
    setFormError(null); // Clear previous errors
    setSelectedBookingIdForForm(bookingId);
    setIsInfoFormModalOpen(true);
  };

  const closeInfoFormModal = () => {
    setIsInfoFormModalOpen(false);
    setSelectedBookingIdForForm(null);
    setFormError(null); // Clear errors on close
  };

  // --- Stripe Payment Handling ---

  const handlePayDepositClick = async (bookingId: string) => {
    setIsCreatingCheckoutSession(bookingId);
    setPaymentStatusMessage(null); // Clear previous messages
    setFormError(null); // Clear other errors
    setUploadError(null);

    try {
      // No need to manually get the token here, supabase.functions.invoke handles it

      // Call the Edge Function using supabase.functions.invoke
      // The function name is the directory name of the function
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        method: 'POST', // Method is often optional here but good practice
        body: { bookingId },
      });

      if (error) {
        console.error('Error invoking create-stripe-checkout function:', error);
        // Handle different error types if needed (e.g., function error vs network error)
        throw new Error(error.message || 'Failed to initiate payment. Please try again.');
      }

      // Assuming the function returns { url: '...' } on success
      if (data?.url) {
        window.location.href = data.url;
      } else {
        // Handle cases where the function succeeded but didn't return a URL
        console.error('Function executed but did not return a redirect URL:', data);
        throw new Error('Missing redirect URL from payment initiation.');
      }
      // Note: No need to reset isCreatingCheckoutSession here, as the page redirects

    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      setPaymentStatusMessage({ type: 'error', message: error.message || 'An unexpected error occurred.' });
      setIsCreatingCheckoutSession(null); // Reset loading state on error
    }
  };

  // --- Effect to handle redirect back from Stripe ---
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentStatus = query.get('payment');
    const sessionId = query.get('session_id');

    // Clear message after a delay if it exists
    let messageTimeoutId: any = null; // Use any to bypass potential NodeJS type issue
    if (paymentStatusMessage) {
      messageTimeoutId = setTimeout(() => setPaymentStatusMessage(null), 7000); // Clear message after 7 seconds
    }

    if (isVerifyingPayment) {
      return; // Don't run verification multiple times if already running
    }

    const verifyPayment = async (stripeSessionId: string) => {
      setIsVerifyingPayment(true);
      setPaymentStatusMessage({ type: 'info', message: 'Verifying payment, please wait...' });

      try {
        // No need to manually get token here

        // Call the Edge Function using supabase.functions.invoke
        const { data: verificationData, error } = await supabase.functions.invoke('verify-stripe-payment', {
           method: 'POST',
           body: { session_id: stripeSessionId },
        });


        if (error) {
           console.error('Error invoking verify-stripe-payment function:', error);
           throw new Error(error.message || 'Payment verification failed.');
        }

        // Process verificationData as before
        if (verificationData.success && verificationData.status === 'paid') {
          setPaymentStatusMessage({ type: 'success', message: 'Deposit payment successful! Your booking is updated.' });
          // Refresh bookings to show updated status
          fetchUserBookings();
        } else {
           // Handle cases where verification succeeded but payment wasn't 'paid' (e.g., session expired)
           console.warn('Payment verification complete, but status was not paid:', verificationData.status);
           setPaymentStatusMessage({ type: 'info', message: `Payment status: ${verificationData.status || 'pending'}. Please check again later or contact support.` });
        }

      } catch (error: any) {
        console.error('Payment verification error:', error);
        setPaymentStatusMessage({ type: 'error', message: error.message || 'Failed to verify payment.' });
      } finally {
        setIsVerifyingPayment(false);
         // Clean up URL regardless of outcome
         window.history.replaceState(null, '', window.location.pathname);
      }
    };


    if (paymentStatus === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (paymentStatus === 'cancel') {
       setPaymentStatusMessage({ type: 'info', message: 'Payment process cancelled.' });
       // Clean up URL
       window.history.replaceState(null, '', window.location.pathname);
    }

    // Cleanup function for the timeout
    return () => {
      if (messageTimeoutId) {
        clearTimeout(messageTimeoutId);
      }
    };

  // Add fetchUserBookings to dependencies if needed, but be cautious of infinite loops
  // Run only once on mount or when location might change if using router state
  }, [fetchUserBookings]); // Only re-run if fetchUserBookings changes (due to useCallback dependencies)

  // --- Actual implementation for handleInformationFormSubmit ---
  const handleInformationFormSubmit = async (formData: BookingFormData) => {
    if (!selectedBookingIdForForm) {
        setFormError("Cannot submit form: Booking ID is missing.");
        return;
    }
    setIsSubmitting(true);
    setFormError(null);

    try {
       // 1. Prepare data for booking_details table
       const detailsData: Omit<BookingDetailsInsert, 'id' | 'created_at' | 'updated_at'> = {
            booking_id: selectedBookingIdForForm,
            // Map personal details
            first_name: formData.personal.firstName,
            last_name: formData.personal.lastName,
            birthday: formData.personal.birthday || null, // Handle empty string dates
            country: formData.personal.country,
            address: formData.personal.address,
            city: formData.personal.city,
            zip_code: formData.personal.zipCode,
            phone: formData.personal.phone,
            email: formData.personal.email,
            // Map emergency contact
            emergency_name: formData.emergencyContact.name,
            emergency_relationship: formData.emergencyContact.relationship,
            emergency_phone: formData.emergencyContact.phone,
            // Map medical info
            has_medical_conditions: formData.medical.hasConditions,
            medical_conditions_details: formData.medical.conditionsDetails,
            takes_medications: formData.medical.takesMedications,
            medications_details: formData.medical.medicationsDetails,
            has_dietary_restrictions: formData.medical.hasDietaryRestrictions,
            dietary_restrictions_details: formData.medical.dietaryRestrictionsDetails,
            // Map signature
            signature_name: formData.signature.name,
            signature_date: formData.signature.date || null, // Handle empty string dates
        };

      // 2. Insert into booking_details
      const { error: detailsError } = await supabase
        .from('booking_details')
        .insert(detailsData);

      if (detailsError) {
        // Handle potential unique constraint violation (form already submitted)
        if (detailsError.code === '23505') { // PostgreSQL unique violation code
            // Optionally update existing details instead of failing
            console.warn('Booking details already exist for this booking. Consider updating instead.', detailsError);
            // For now, we'll proceed to update the booking status regardless
        } else {
            console.error('Error inserting booking details:', detailsError);
            throw new Error(`Failed to save form details: ${detailsError.message}`);
        }
      }

      // 3. Update bookings table to mark form as filled
      const { error: bookingUpdateError } = await supabase
        .from('bookings')
        .update({ forms_filled: true, updated_at: new Date().toISOString() })
        .eq('id', selectedBookingIdForForm);

      if (bookingUpdateError) {
        console.error('Error updating booking status:', bookingUpdateError);
        // Consider how to handle this - maybe the details were saved but status update failed?
        throw new Error(`Failed to update booking status: ${bookingUpdateError.message}`);
      }

      // 4. Success: Update local state immediately for better UX
       setBookings(prevBookings => prevBookings.map(b =>
         b.id === selectedBookingIdForForm ? { ...b, formsFilled: true } : b
       ));

      closeInfoFormModal(); // Close modal on success
      // Optionally show a success message

    } catch (error: any) {
      console.error('Form submission failed:', error);
      setFormError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Upload Modal Handlers ---
  const openUploadModal = (bookingId: string) => {
    setUploadError(null); // Clear previous errors
    setSelectedBookingIdForUpload(bookingId);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedBookingIdForUpload(null);
    setUploadError(null); // Clear errors on close
  };

  // --- Actual implementation for handleDocumentUploadSubmit ---
  const handleDocumentUploadSubmit = async (bookingId: string, file: File) => {
    if (!user?.id) {
        setUploadError("User not identified. Cannot upload file.");
        return;
    }
    if (!bookingId) {
        setUploadError("Cannot upload document: Booking ID is missing.");
        return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      // 1. Create a unique file path
      // Ensure file name is sanitized (basic example)
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `public/${user.id}/${bookingId}-${Date.now()}-${sanitizedFileName}`;
      const bucketName = 'docs'; // Define bucket name

      // 2. Upload file to Supabase Storage
      // Ensure bucket 'docs' exists in your Supabase project with appropriate policies.
      // Typically, make the bucket public for reads if needed, or create signed URLs.
      // For uploads, ensure authenticated users have insert permissions.
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          // cacheControl: '3600', // Optional: Cache control header
          upsert: false, // Set to true to overwrite existing file with same path, false to fail
        });

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      if (!uploadData?.path) {
          throw new Error('File upload succeeded but did not return a path.');
      }

      const documentPath = uploadData.path; // Get the path relative to the bucket

      // 3. Update bookings table with document path and status
      const { error: bookingUpdateError } = await supabase
        .from('bookings')
        .update({
          files_uploaded: true,
          document_path: documentPath,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (bookingUpdateError) {
        console.error('Error updating booking after upload:', bookingUpdateError);
        // Consider compensating action: delete the uploaded file if DB update fails?
        // await supabase.storage.from(bucketName).remove([filePath]);
        throw new Error(`Failed to update booking record after upload: ${bookingUpdateError.message}`);
      }

      // 4. Success: Update local state
      setBookings(prevBookings => prevBookings.map(b =>
        b.id === bookingId ? { ...b, filesUploaded: true, documentPath: documentPath } : b
      ));

      closeUploadModal(); // Close modal on success
      // Optionally show success message

    } catch (error: any) {
      console.error('Document upload process failed:', error);
      setUploadError(error.message || 'An unexpected error occurred during upload. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* --- Display Payment Status Message --- */}
          {paymentStatusMessage && (
             <div className={`p-4 mb-6 rounded-md border ${
               paymentStatusMessage.type === 'success' ? 'bg-green-100 border-green-400 text-green-800' :
               paymentStatusMessage.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
               'bg-blue-100 border-blue-400 text-blue-700' // Info
             }`}>
               <div className="flex items-center">
                 {paymentStatusMessage.type === 'success' && <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />}
                 {paymentStatusMessage.type === 'error' && <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />}
                 {paymentStatusMessage.type === 'info' && <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />} {/* Or a different icon */}
                 <span className="text-sm">{paymentStatusMessage.message}</span>
               </div>
             </div>
          )}

          {!isAuthLoading && user && (
            <div className="bg-tactical-900 text-white rounded-xl p-8 mb-8 shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl font-heading font-bold mb-2">
                    Welcome, {user?.firstName || 'Trainee'}
                  </h1>
                  <p className="text-gray-300">
                    Manage your tactical training packages and track your progress.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="accent" onClick={() => setIsBookingModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Training
                  </Button>
                </div>
              </div>
            </div>
          )}
          {isAuthLoading && (
            <div className="bg-tactical-900 text-white rounded-xl p-8 mb-8 shadow-lg animate-pulse">
              <div className="h-8 bg-tactical-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-tactical-600 rounded w-1/2"></div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-8 min-h-[300px]">
                <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4">
                  Your Upcoming Trainings
                </h2>

                {showOverallLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tactical-700"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12 bg-tactical-50 rounded-lg">
                    <Package className="w-12 h-12 text-tactical-400 mx-auto mb-4" />
                    <h3 className="font-medium text-tactical-800 mb-2">No trainings booked yet</h3>
                    <p className="text-tactical-600 mb-6">
                      Start your tactical journey by booking your first training package.
                    </p>
                    <Button variant="primary" onClick={() => setIsBookingModalOpen(true)}>
                      Browse Training Packages
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => {
                      const course = getCourseById(booking.courseId);
                      if (!course) {
                         console.warn(`Course with ID ${booking.courseId} not found in static data for booking ${booking.id}`);
                         return null; // Skip rendering if course data isn't available
                      }
                      const depositAmount = 1000;

                      // --- Use actual data from booking state ---
                      const isFormFilled = !!booking.formsFilled; // Use actual status
                      const isDocsUploaded = !!booking.filesUploaded; // Use actual status
                      const isMeetingScheduled = false; // Keep mock or implement logic if needed

                      // Payment status logic (keep as is for now, can be refined)
                      // Consider specific payment statuses like 'pending_deposit', 'pending_full', 'paid'
                      const isPaid = booking.paymentStatus === 'paid';
                      const isDepositPaid = booking.paymentStatus === 'paid' || booking.paymentStatus === 'deposit_paid';
                      const isPaidInFull = isPaid;

                      // Determine if action is required based on actual statuses
                      const isActionRequired = !(isFormFilled && isDocsUploaded && isDepositPaid);
                      const isConfirmed = !isActionRequired; // Basic confirmation logic

                      const openCalendly = () => {
                        if ((window as any).Calendly) {
                          (window as any).Calendly.initPopupWidget({url: 'https://calendly.com/rosh-en-ab-d-ulla-h27'});
                        } else {
                          console.error('Calendly script not loaded yet');
                        }
                      };

                      return (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-tactical-300 transition-colors duration-200 ease-in-out"
                        >
                          <div className="flex flex-col md:flex-row justify-between">
                            {/* Left Side - Course Details (mostly unchanged) */}
                            <div className="mb-4 md:mb-0 md:pr-4 flex-grow">
                              <h3 className="font-heading font-semibold text-lg text-tactical-900">
                                {course.title}
                              </h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <Calendar className="w-4 h-4 mr-1.5 text-tactical-500 flex-shrink-0" />
                                  {/* TODO: Fetch and display actual course date from course_dates table */}
                                  {booking.createdAt ? `Booked: ${formatDate(booking.createdAt)}` : 'Date TBD'}
                                </div>
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <Clock className="w-4 h-4 mr-1.5 text-tactical-500 flex-shrink-0" />
                                   {/* Ensure course object has duration, provide fallback */}
                                  {course?.duration ? `${course.duration} days` : 'Duration N/A'}
                                </div>
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <MapPin className="w-4 h-4 mr-1.5 text-tactical-500 flex-shrink-0" />
                                  {/* TODO: Make location dynamic if it varies per course/date */}
                                  S-Arms Shooting Range, Tallinn
                                </div>
                              </div>

                                {/* Add-ons display (unchanged, assumes extras are handled elsewhere) */}
                              {booking.extras && booking.extras.length > 0 && (
                                <div className="mt-3">
                                   <p className="text-sm text-tactical-700 font-medium mb-1">Add-ons:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {booking.extras.map(extra => (
                                       <span key={extra.id} className="bg-tactical-100 text-tactical-800 text-xs px-2 py-1 rounded-full">
                                        {extra.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>


                            {/* Right Side - Status, Actions, Payment */}
                            <div className="flex flex-col items-start md:items-end md:min-w-[260px] md:max-w-[300px] flex-shrink-0">
                              {/* Status Badge */}
                              {isActionRequired ? (
                                <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 capitalize flex items-center">
                                   <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                   Action Required
                                </div>
                              ) : (
                                <div className="bg-green-100 text-green-800 border border-green-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 capitalize flex items-center">
                                   <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                   {/* Refine confirmation text based on payment status */}
                                   {isPaidInFull ? 'Confirmed & Paid' : (isDepositPaid ? 'Confirmed (Deposit Paid)' : 'Confirmed')}
                                </div>
                              )}

                              {/* Total Amount */}
                              <div className="text-lg font-bold text-tactical-900 mb-3 w-full text-left md:text-right">
                                Total: {formatCurrency(booking.totalAmount)}
                              </div>

                              {/* === Actions Section (Using actual data) === */}
                              <div className="w-full space-y-4 border-t border-gray-200 pt-4 mt-2">

                                {/* --- Mandatory Steps --- */}
                                {isActionRequired && (
                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-tactical-800 mb-2 text-left md:text-right">Complete these steps:</p>
                                    <ul className="space-y-2">
                                      {/* Fill Form Step - Uses booking.formsFilled */}
                                      <li className="flex items-center justify-between min-h-[30px]">
                                        <div className={`flex items-center ${isFormFilled ? 'text-gray-400' : 'text-tactical-700'}`}>
                                          {isFormFilled ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <FileText className="w-4 h-4 mr-2 text-tactical-500" />}
                                          <span className={`text-sm ${isFormFilled ? 'line-through' : ''}`}>Fill Information Form</span>
                                        </div>
                                        {!isFormFilled && (
                                          <Button variant="outline" size="sm" onClick={() => openInfoFormModal(booking.id)} className="ml-2 whitespace-nowrap" disabled={isSubmitting}>
                                            {isSubmitting && selectedBookingIdForForm === booking.id ? 'Saving...' : 'Fill Form'}
                                          </Button>
                                        )}
                                      </li>

                                      {/* Upload Documents Step - Uses booking.filesUploaded */}
                                      <li className="flex items-center justify-between min-h-[30px]">
                                        <div className={`flex items-center ${isDocsUploaded ? 'text-gray-400' : 'text-tactical-700'}`}>
                                          {isDocsUploaded ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Upload className="w-4 h-4 mr-2 text-tactical-500" />}
                                          <span className={`text-sm ${isDocsUploaded ? 'line-through' : ''}`}>Upload Background Check</span>
                                          {/* Optional: Link to view uploaded doc */}
                                          {/* {isDocsUploaded && booking.documentPath && (
                                              <a href={supabase.storage.from('booking-documents').getPublicUrl(booking.documentPath).data.publicUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline ml-2">(View)</a>
                                          )} */}
                                        </div>
                                        {!isDocsUploaded && (
                                          <Button variant="outline" size="sm" onClick={() => openUploadModal(booking.id)} className="ml-2 whitespace-nowrap" disabled={isSubmitting}>
                                             {isSubmitting && selectedBookingIdForUpload === booking.id ? 'Uploading...' : 'Upload Doc'}
                                          </Button>
                                        )}
                                      </li>

                                      {/* Pay Deposit Step - Uses isDepositPaid */}
                                      <li className="flex items-center justify-between min-h-[30px]">
                                        <div className={`flex items-center ${isDepositPaid ? 'text-gray-400' : 'text-tactical-700'}`}>
                                          {isDepositPaid ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <CreditCard className="w-4 h-4 mr-2 text-tactical-500" />}
                                          <span className={`text-sm ${isDepositPaid ? 'line-through' : ''}`}>Pay Deposit ({formatCurrency(depositAmount)})</span>
                                        </div>
                                        {!isDepositPaid && (
                                          <Button
                                             variant="accent"
                                             size="sm"
                                             onClick={() => handlePayDepositClick(booking.id)}
                                             className="ml-2 whitespace-nowrap"
                                             disabled={isCreatingCheckoutSession === booking.id || isVerifyingPayment} // Disable while processing this or any payment
                                          >
                                            {isCreatingCheckoutSession === booking.id ? 'Processing...' : 'Pay Deposit'}
                                          </Button>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* --- Pay Remaining (Conditional) --- */}
                                {isDepositPaid && !isPaidInFull && booking.totalAmount > depositAmount && (
                                  <div className="text-left md:text-right">
                                     {/* TODO: Implement actual payment logic/link */}
                                    <Button variant="primary" size="sm" onClick={() => alert(`Redirect to pay remaining for ${booking.id}`)} className="w-full md:w-auto justify-center">
                                      Pay Remaining ({formatCurrency(booking.totalAmount - depositAmount)})
                                    </Button>
                                  </div>
                                )}

                                {/* --- Next Steps / Optional --- */}
                                 {/* Show meeting only if booking is confirmed (all mandatory done) */}
                                {isConfirmed && (
                                    <div className="mt-4 border-t border-gray-200 pt-4">
                                    <ul className="space-y-2">
                                        <li className="flex items-center justify-between min-h-[30px]">
                                        <div className={`flex items-center ${isMeetingScheduled ? 'text-gray-400' : 'text-tactical-700'}`}>
                                          {isMeetingScheduled ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Calendar className="w-4 h-4 mr-2 text-tactical-500" />}
                                          <span className={`text-sm ${isMeetingScheduled ? 'line-through' : ''}`}>Schedule Instructor Meeting</span>
                                        </div>
                                        {!isMeetingScheduled && (
                                           <Button variant="outline" size="sm" onClick={openCalendly} className="ml-2 whitespace-nowrap">
                                             Schedule Meeting
                                           </Button>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                )}

                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

             {/* Profile & Help Sections (unchanged) */}
            <div className="space-y-6">
              {!isAuthLoading && user ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4">
                    Your Profile
                  </h2>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-tactical-200 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-8 h-8 text-tactical-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-tactical-900">
                        {/* Display user's first and last name if available */}
                        {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Trainee'}
                      </h3>
                       {/* Display user's email */}
                      <p className="text-sm text-tactical-600 break-all">{user.email || 'No email found'}</p>
                    </div>
                  </div>
                   {/* Profile action buttons */}
                  <div className="space-y-3">
                    <Link to="/profile">
                      <Button variant="outline" fullWidth>Edit Profile</Button>
                    </Link>
                    <Link to="/change-password">
                      <Button variant="ghost" fullWidth>Change Password</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Profile loading skeleton */
                <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-40"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              )}

              {/* Need Help? section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4">
                  Need Help?
                </h2>
                <p className="text-tactical-700 text-sm mb-4">
                  Have questions about your training or need to make changes? Our team is here to help.
                </p>
                <div className="space-y-3">
                  <Link to="/contact">
                    <Button variant="primary" fullWidth>Contact Support</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Book New Training Modal */}
      <Modal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title="Select Training Package"
      >
        <Courses showLayout={false} /> {/* Assumes Courses component handles its own logic */}
      </Modal>

      {/* Information Form Modal */}
      <Modal
        isOpen={isInfoFormModalOpen}
        onClose={closeInfoFormModal}
        title="Provide Booking Information"
        // Optional: Add footer for error display or use inline error display
      >
         {/* Display Form Error Message */}
        {formError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{formError}</span>
          </div>
        )}
        {selectedBookingIdForForm && (
          <BookingInformationForm
            bookingId={selectedBookingIdForForm}
            onClose={closeInfoFormModal}
            onSubmit={handleInformationFormSubmit}
            // Pass loading state if the form component needs it
            isSubmitting={isSubmitting} // Pass submitting state
          />
        )}
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        title="Upload Criminal Background Check"
         // Optional: Add footer for error display or use inline error display
      >
         {/* Display Upload Error Message */}
        {uploadError && (
           <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 flex items-center">
             <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
             <span className="text-sm">{uploadError}</span>
           </div>
        )}
        {selectedBookingIdForUpload && (
          <UploadDocumentForm
            bookingId={selectedBookingIdForUpload}
            onClose={closeUploadModal}
            uploadFile={handleDocumentUploadSubmit}
            // Pass loading state if the form component needs it
            isSubmitting={isSubmitting} // Pass submitting state
          />
        )}
      </Modal>
    </>
  );
};

export default Dashboard;