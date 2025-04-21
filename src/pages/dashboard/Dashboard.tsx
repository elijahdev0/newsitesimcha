import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Package, Plus, Users } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useBookingStore } from '../../store/bookingStore';
import { Booking, Course } from '../../types';
import { courses } from '../../data/courses';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { getBookings } = useBookingStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const userBookings = await getBookings();
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate, getBookings]);

  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(course => course.id === courseId);
  };

  return (
    <>
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
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
                <Link to="/courses">
                  <Button variant="accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Book New Training
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4">
                  Your Upcoming Trainings
                </h2>

                {isLoading ? (
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
                      return (
                        <div 
                          key={booking.id} 
                          className="border border-gray-200 rounded-lg p-4 hover:border-tactical-300 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="font-heading font-semibold text-lg text-tactical-900">
                                {course?.title || 'Training Package'}
                              </h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <Calendar className="w-4 h-4 mr-1.5 text-tactical-500" />
                                  {formatDate(new Date().toISOString())}
                                </div>
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <Clock className="w-4 h-4 mr-1.5 text-tactical-500" />
                                  {course?.duration || 0} days
                                </div>
                                <div className="flex items-center text-tactical-600 text-sm">
                                  <MapPin className="w-4 h-4 mr-1.5 text-tactical-500" />
                                  S-Arms Shooting Range, Tallinn
                                </div>
                              </div>
                              
                              {booking.extras.length > 0 && (
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
                            
                            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                              <div className="bg-accent-500 text-white text-xs font-medium px-2.5 py-1 rounded-full mb-2">
                                {booking.status}
                              </div>
                              <div className="text-lg font-bold text-tactical-900">
                                {formatCurrency(booking.totalAmount)}
                              </div>
                              <div className="text-xs text-tactical-600 mt-1">
                                Payment: {booking.paymentStatus}
                              </div>
                              <Link to={`/bookings/${booking.id}`} className="mt-3">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
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
                    <p className="text-sm text-tactical-600">{user?.email}</p>
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

              {/* Support Card */}
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
                  <Link to="/faq">
                    <Button variant="ghost" fullWidth>
                      View FAQs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;