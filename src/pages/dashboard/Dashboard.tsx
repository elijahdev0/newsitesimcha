import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Package, Plus, Users, Upload, FileText, CreditCard } from 'lucide-react';
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const { getBookings } = useBookingStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
                    <Link to="/courses">
                      <Button variant="primary">
                        Browse Training Packages
                      </Button>
                    </Link>
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
                      // Simplify mock: Consider paid if booking.paymentStatus is 'paid'
                      const isPaid = booking.paymentStatus === 'paid';
                      const isDepositPaid = isPaid; // Treat 'paid' as having met deposit requirement for demo
                      const isPaidInFull = isPaid;  // Treat 'paid' as full payment for demo

                      const showActionRequired = !(isDocsUploaded && isFormFilled && isDepositPaid);

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
                              {showActionRequired ? (
                                <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 capitalize flex items-center">
                                   <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                   Action Required
                                </div>
                              ) : (
                                <div className="bg-green-100 text-green-800 border border-green-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 capitalize flex items-center">
                                   <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                   {/* If action not required, assume confirmed. Check if paid in full for badge text. */}
                                   {isPaidInFull ? 'Confirmed & Paid' : 'Confirmed'}
                                </div>
                              )}

                              {/* Total Amount */}
                              <div className="text-lg font-bold text-tactical-900 mb-3 w-full text-left md:text-right">
                                Total: {formatCurrency(booking.totalAmount)}
                              </div>

                              {/* Action Required Section */}
                              {showActionRequired && (
                                <div className="w-full border-t border-gray-200 pt-3 mt-1 mb-4">
                                  <p className="text-sm font-medium text-tactical-800 mb-2 text-left md:text-right">Complete these steps:</p>
                                  <ul className="space-y-1.5 text-sm text-tactical-700 text-left md:text-right">
                                    <ActionItem label="Upload Required Documents" isComplete={isDocsUploaded} IconComponent={Upload} />
                                    <ActionItem label="Fill Out Information Form" isComplete={isFormFilled} IconComponent={FileText} />
                                    <ActionItem label={`Pay Deposit (${formatCurrency(depositAmount)})`} isComplete={isDepositPaid} IconComponent={CreditCard} />
                                  </ul>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto mt-auto justify-start md:justify-end">
                                {/* Conditionally show buttons based on mock status */}
                                {!isDocsUploaded && (
                                  <Button variant="outline" size="sm" onClick={() => alert(`Mock: Upload Docs for ${booking.id}`)} className="flex-grow md:flex-grow-0 justify-center">
                                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Docs
                                  </Button>
                                )}
                                {!isFormFilled && (
                                  <Button variant="outline" size="sm" onClick={() => alert(`Mock: Fill Form for ${booking.id}`)} className="flex-grow md:flex-grow-0 justify-center">
                                    <FileText className="w-3.5 h-3.5 mr-1.5" /> Fill Form
                                  </Button>
                                )}
                                {!isDepositPaid && (
                                  <>
                                    <Button variant="accent" size="sm" onClick={() => alert(`Mock: Pay Deposit for ${booking.id}`)} className="flex-grow md:flex-grow-0 justify-center">
                                      Pay Deposit ({formatCurrency(depositAmount)})
                                    </Button>
                                    {/* Show Pay Full button only if deposit is not sufficient for full amount */}
                                    {booking.totalAmount > depositAmount && (
                                      <Button variant="primary" size="sm" onClick={() => alert(`Mock: Pay Full for ${booking.id}`)} className="flex-grow md:flex-grow-0 justify-center">
                                        Pay Full ({formatCurrency(booking.totalAmount)})
                                      </Button>
                                    )}
                                  </>
                                )}
                                {isDepositPaid && !isPaidInFull && booking.totalAmount > depositAmount && (
                                  <Button variant="primary" size="sm" onClick={() => alert(`Mock: Pay Remaining for ${booking.id}`)} className="flex-grow md:flex-grow-0 justify-center">
                                    Pay Remaining ({formatCurrency(booking.totalAmount - depositAmount)})
                                  </Button>
                                )}
                              </div>

                              {/* View Details Link - REMOVED */}
                              {/* 
                              <Link to={`/bookings/${booking.id}`} className="mt-3 text-sm text-tactical-600 hover:text-tactical-900 hover:underline self-start md:self-end">
                                View Full Booking Details
                              </Link>
                              */}

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
    </>
  );
};

// Helper component for Action Items (can be placed at the bottom of the file or imported)
const ActionItem: React.FC<{ label: string; isComplete: boolean; IconComponent: React.ElementType }> = ({ label, isComplete, IconComponent }) => (
  <li className={`flex items-center justify-start md:justify-end ${isComplete ? 'text-gray-400' : ''}`}>
    <span className={`mr-2 ${isComplete ? 'line-through' : ''}`}>{label}</span>
    {isComplete ? (
      // CheckCircle Icon (inline SVG or import from lucide-react if preferred)
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
    ) : (
      <IconComponent className="w-4 h-4 text-tactical-500" />
    )}
  </li>
);

export default Dashboard;