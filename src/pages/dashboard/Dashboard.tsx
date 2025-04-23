import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useBookingStore } from '../../store/bookingStore';
import { Booking, Course } from '../../types';
import { courses } from '../../data/courses';
import { Modal } from '../../components/common/Modal';
import Courses from '../Courses';
import { BookingInformationForm } from '../../components/dashboard/BookingInformationForm';
import { UploadDocumentForm } from '../../components/dashboard/UploadDocumentForm';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { getBookings } = useBookingStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isInfoFormModalOpen, setIsInfoFormModalOpen] = useState(false);
  const [selectedBookingIdForForm, setSelectedBookingIdForForm] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBookingIdForUpload, setSelectedBookingIdForUpload] = useState<string | null>(null);

  // Load Calendly script
  useEffect(() => {
    const scriptId = 'calendly-widget-script';
    if (document.getElementById(scriptId)) return; // Prevent duplicate script loading

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Optional: Cleanup function if needed, though script load is usually fine globally
    // return () => { ... };
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        const fetchBookings = async () => {
          setIsLoadingBookings(true);
          try {
            const userBookings = await getBookings();
            setBookings(userBookings);
          } catch (error) {
            console.error('Error fetching bookings:', error);
          } finally {
            setIsLoadingBookings(false);
          }
        };
        fetchBookings();
      }
    }
  }, [isAuthLoading, isAuthenticated, navigate, getBookings]);

  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(course => course.id === courseId);
  };

  const showOverallLoading = isAuthLoading || isLoadingBookings;

  // --- Modal Handlers ---

  // Helper function to open the info form modal
  const openInfoFormModal = (bookingId: string) => {
    setSelectedBookingIdForForm(bookingId);
    setIsInfoFormModalOpen(true);
  };

  // Helper function to close the info form modal
  const closeInfoFormModal = () => {
    setIsInfoFormModalOpen(false);
    setSelectedBookingIdForForm(null);
  };

  // Placeholder function to handle form submission
  // TODO: Replace with actual submission logic (e.g., API call to update booking)
  const handleInformationFormSubmit = (formData: any) => {
    console.log('Received form data in Dashboard:', formData);
    // Mark form as filled (update booking state - this is a mock update)
    // You'll need a way to actually update the booking status based on the API response
    // and potentially update the 'isFormFilled' flag on the specific booking
    setBookings(prevBookings => prevBookings.map((b: Booking) =>
      b.id === formData.bookingId ? { ...b, /* isFormFilled: true */ } : b // Update actual status flag later
    ));
    closeInfoFormModal(); // Close modal after submission
    alert('Information form submitted! (Mock update - status change is temporary)');
  };

  // --- Upload Modal Handlers ---
  const openUploadModal = (bookingId: string) => {
    setSelectedBookingIdForUpload(bookingId);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedBookingIdForUpload(null);
  };

  // Placeholder function to handle document upload submission
  // TODO: Replace with actual upload logic (e.g., API call)
  const handleDocumentUploadSubmit = (bookingId: string, file: File) => {
    console.log('Uploading document for booking:', bookingId, '; File:', file.name);
    // Mock update: Mark docs as uploaded for the specific booking
    // In a real app, you'd wait for the API response before updating state
    setBookings(prevBookings => prevBookings.map((b: Booking) =>
      b.id === bookingId ? { ...b, /* isDocsUploaded: true */ } : b // Update actual status flag later
    ));
    closeUploadModal();
    alert(`Document '${file.name}' upload initiated! (Mock update)`);
  };

  // --- Data Fetching ---
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else {
        const fetchBookings = async () => {
          setIsLoadingBookings(true);
          try {
            const userBookings = await getBookings();
            setBookings(userBookings);
          } catch (error) {
            console.error('Error fetching bookings:', error);
          } finally {
            setIsLoadingBookings(false);
          }
        };
        fetchBookings();
      }
    }
  }, [isAuthLoading, isAuthenticated, navigate, getBookings]);

  return (
    <>
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
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
                      if (!course) return null;
                      const depositAmount = 1000; // Define deposit amount

                      // Mock completion status for UI demo - replace with actual booking data later
                      // For this mock, we assume actions are needed unless paymentStatus is 'paid'.
                      // A real implementation would likely involve more detailed status fields.
                      const isDocsUploaded = false; // Assume false for demo
                      const isFormFilled = false;   // Assume false for demo
                      const isMeetingScheduled = false; // Add mock state for meeting
                      // Simplify mock: Consider paid if booking.paymentStatus is 'paid'
                      const isPaid = booking.paymentStatus === 'paid';
                      const isDepositPaid = isPaid; // Treat 'paid' as having met deposit requirement for demo
                      const isPaidInFull = isPaid;  // Treat 'paid' as full payment for demo

                      // Update showActionRequired to ONLY include mandatory steps
                      const isActionRequired = !(isDocsUploaded && isFormFilled && isDepositPaid);
                      // Determine overall confirmed status (all mandatory steps done)
                      const isConfirmed = !isActionRequired;

                      // --- Function to open Calendly --- 
                      const openCalendly = () => {
                        if ((window as any).Calendly) {
                          (window as any).Calendly.initPopupWidget({url: 'https://calendly.com/rosh-en-ab-d-ulla-h27'});
                        } else {
                          console.error('Calendly script not loaded yet');
                          // Optionally, show an error message to the user
                        }
                      };

                      return (
                        <div
                          key={booking.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-tactical-300 transition-colors duration-200 ease-in-out"
                        >
                          <div className="flex flex-col md:flex-row justify-between">
                            {/* Left Side - Course Details */}
                            <div className="mb-4 md:mb-0 md:pr-4 flex-grow">
                              <h3 className="font-heading font-semibold text-lg text-tactical-900">
                                {course.title}
                              </h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <Calendar className="w-4 h-4 mr-1.5 text-tactical-500 flex-shrink-0" />
                                  {/* TODO: Replace booking.createdAt with actual scheduled date if available */}
                                  {booking.createdAt ? `Booked: ${formatDate(booking.createdAt)}` : 'Date TBD'}
                                </div>
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <Clock className="w-4 h-4 mr-1.5 text-tactical-500 flex-shrink-0" />
                                  {course?.duration || 0} days
                                </div>
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <MapPin className="w-4 h-4 mr-1.5 text-tactical-500 flex-shrink-0" />
                                  {/* TODO: Make location dynamic */}
                                  S-Arms Shooting Range, Tallinn
                                </div>
                              </div>

                              {booking.extras && booking.extras.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm text-tactical-700 font-medium mb-1">
                                    Add-ons:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {booking.extras.map(extra => (
                                      <span
                                        key={extra.id}
                                        className="bg-tactical-100 text-tactical-800 text-xs px-2 py-1 rounded-full"
                                      >
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
                                   <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                   Action Required
                                </div>
                              ) : (
                                <div className="bg-green-100 text-green-800 border border-green-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 capitalize flex items-center">
                                   <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                   {isPaidInFull ? 'Confirmed & Paid' : 'Confirmed'}
                                </div>
                              )}

                              {/* Total Amount */}
                              <div className="text-lg font-bold text-tactical-900 mb-3 w-full text-left md:text-right">
                                Total: {formatCurrency(booking.totalAmount)}
                              </div>

                              {/* === Redesigned Action Section === */}
                              <div className="w-full space-y-4 border-t border-gray-200 pt-4 mt-2">

                                {/* --- Mandatory Steps --- */}
                                {isActionRequired && (
                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-tactical-800 mb-2 text-left md:text-right">Complete these steps to reserve your spot:</p>
                                    <ul className="space-y-2">
                                      {/* Fill Form Step - Moved to be first */}
                                      <li className="flex items-center justify-between">
                                        <div className={`flex items-center ${isFormFilled ? 'text-gray-400' : 'text-tactical-700'}`}>
                                          {isFormFilled ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <FileText className="w-4 h-4 mr-2 text-tactical-500" />}
                                          <span className={`text-sm ${isFormFilled ? 'line-through' : ''}`}>Fill Information Form</span>
                                        </div>
                                        {!isFormFilled && (
                                          <Button variant="outline" size="sm" onClick={() => openInfoFormModal(booking.id)} className="ml-2 whitespace-nowrap">
                                            Fill Form
                                          </Button>
                                        )}
                                      </li>

                                      {/* Upload Documents Step - Moved to be second */}
                                      <li className="flex items-center justify-between">
                                        <div className={`flex items-center ${isDocsUploaded ? 'text-gray-400' : 'text-tactical-700'}`}>
                                          {isDocsUploaded ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <Upload className="w-4 h-4 mr-2 text-tactical-500" />}
                                          <span className={`text-sm ${isDocsUploaded ? 'line-through' : ''}`}>Upload Documents</span>
                                        </div>
                                        {!isDocsUploaded && (
                                          <Button variant="outline" size="sm" onClick={() => openUploadModal(booking.id)} className="ml-2 whitespace-nowrap">
                                            Upload Docs
                                          </Button>
                                        )}
                                      </li>

                                      {/* Pay Deposit Step - Remains third */}
                                      <li className="flex items-center justify-between">
                                        <div className={`flex items-center ${isDepositPaid ? 'text-gray-400' : 'text-tactical-700'}`}>
                                          {isDepositPaid ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <CreditCard className="w-4 h-4 mr-2 text-tactical-500" />}
                                          <span className={`text-sm ${isDepositPaid ? 'line-through' : ''}`}>Pay Deposit ({formatCurrency(depositAmount)})</span>
                                        </div>
                                        {!isDepositPaid && (
                                          <Button variant="accent" size="sm" onClick={() => alert(`Mock: Pay Deposit for ${booking.id}`)} className="ml-2 whitespace-nowrap">
                                            Pay Deposit
                                          </Button>
                                        )}
                                      </li>
                                    </ul>
                                  </div>
                                )}

                                {/* --- Pay Remaining (Conditional) --- */}
                                {isDepositPaid && !isPaidInFull && booking.totalAmount > depositAmount && (
                                  <div className="text-left md:text-right">
                                    <Button variant="primary" size="sm" onClick={() => alert(`Mock: Pay Remaining for ${booking.id}`)} className="w-full md:w-auto justify-center">
                                      Pay Remaining ({formatCurrency(booking.totalAmount - depositAmount)})
                                    </Button>
                                  </div>
                                )}

                                {/* --- Next Steps / Optional --- */}
                                <div className="mt-4 border-t border-gray-200 pt-4"> {/* Always add separator */} 
                                    <ul className="space-y-2">
                                      {/* Schedule Meeting Step */}
                                      <li className="flex items-center justify-between">
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
                                      {/* Add other optional steps here if needed */}
                                    </ul>
                                  </div>
                                {/* Removed closing parenthesis and curly brace from the isConfirmed condition */}
                                {/* --- End Redesigned Action Section --- */}

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
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-tactical-600 break-all">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link to="/profile">
                      <Button variant="outline" fullWidth>
                        Edit Profile
                      </Button>
                    </Link>
                    <Link to="/change-password">
                      <Button variant="ghost" fullWidth>
                        Change Password
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
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

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4">
                  Need Help?
                </h2>
                <p className="text-tactical-700 text-sm mb-4">
                  Have questions about your training or need to make changes? Our team is here to help.
                </p>
                <div className="space-y-3">
                  <Link to="/contact">
                    <Button variant="primary" fullWidth>
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Modal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        title="Select Training Package"
      >
        <Courses showLayout={false} />
      </Modal>

      {/* Information Form Modal */}
      <Modal
        isOpen={isInfoFormModalOpen}
        onClose={closeInfoFormModal}
        title="Provide Booking Information"
      >
        {selectedBookingIdForForm && (
          <BookingInformationForm
            bookingId={selectedBookingIdForForm}
            onClose={closeInfoFormModal}
            onSubmit={handleInformationFormSubmit}
          />
        )}
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        title="Upload Criminal Background Check"
      >
        {selectedBookingIdForUpload && (
          <UploadDocumentForm
            bookingId={selectedBookingIdForUpload}
            onClose={closeUploadModal}
            onSubmit={handleDocumentUploadSubmit}
          />
        )}
      </Modal>
    </>
  );
};

export default Dashboard;