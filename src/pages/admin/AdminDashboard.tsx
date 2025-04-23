import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Users, CalendarPlus, Loader } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { courses } from '../../data/courses';
import { supabase } from '../../lib/supabase'; // Import Supabase client
import { formatDate, formatCurrency } from '../../utils/formatters';

// Define real user booking type
interface UserBooking {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  totalAmount: number;
  formsFilled: boolean;
  paymentStatus: 'pending' | 'deposit_paid' | 'paid' | 'refunded';
  filesUploaded: boolean;
  documentPath: string | null;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // State for real user bookings
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // State for course scheduling
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [maxParticipants, setMaxParticipants] = useState<number>(10);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);

  // Fetch all users with their bookings
  const fetchUserBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    setBookingsError(null);
    
    try {
      // First fetch all bookings with related information
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          course_id,
          total_amount,
          payment_status,
          forms_filled,
          files_uploaded,
          document_path,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;
      
      // Fetch user details for all users in the bookings
      const userIds = [...new Set(bookingsData.map(booking => booking.user_id))];
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', userIds);
      
      if (usersError) throw usersError;
      
      // Map bookings with user data
      const formattedBookings: UserBooking[] = bookingsData.map(booking => {
        const userData = usersData.find(u => u.id === booking.user_id) || 
                          { first_name: 'Unknown', last_name: 'User', email: 'N/A' };
        
        const courseName = courses.find(c => c.id === booking.course_id)?.title || 'Unknown Course';
        
        return {
          id: booking.id,
          userId: booking.user_id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          phone: 'N/A',
          courseId: booking.course_id,
          courseName,
          totalAmount: booking.total_amount,
          formsFilled: booking.forms_filled || false,
          paymentStatus: booking.payment_status,
          filesUploaded: booking.files_uploaded || false,
          documentPath: booking.document_path,
          createdAt: booking.created_at
        };
      });
      
      setUserBookings(formattedBookings);
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
      setBookingsError(`Failed to load user bookings: ${error.message}`);
      setUserBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);
  
  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchUserBookings();
    }
  }, [isAuthenticated, user, fetchUserBookings]);

  const handleDownloadFile = async (documentPath: string, fileName: string) => {
    try {
      if (!documentPath) {
        alert('No document available for download');
        return;
      }
      
      // Get download URL from Supabase Storage
      const { data, error } = await supabase.storage
        .from('docs') // Use your bucket name here
        .download(documentPath);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'document';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Download error:', error);
      alert(`Failed to download: ${error.message}`);
    }
  };

  const handleScheduleCourse = async () => {
    setScheduleError(null);
    setScheduleSuccess(null);

    if (!selectedCourseId || !startDate || !endDate || maxParticipants <= 0) {
      setScheduleError('Please select a course, valid start/end dates, and set max participants (> 0).');
      return;
    }

    setIsScheduling(true);

    try {
      const newCourseDate = {
        course_id: selectedCourseId,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(), 
        max_participants: maxParticipants,
      };

      const { data, error } = await supabase
        .from('course_dates')
        .insert([newCourseDate])
        .select();

      if (error) {
        throw new Error(error.message || 'Failed to schedule the course date.');
      }

      console.log('Course date scheduled successfully:', data);
      setScheduleSuccess(`Successfully scheduled ${courses.find(c => c.id === selectedCourseId)?.title || 'course'} for ${startDate}.`);

    } catch (err: any) {
      setScheduleError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsScheduling(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="container mx-auto px-4 space-y-8">

          {/* Admin Header */}
          <div className="bg-tactical-900 text-white rounded-xl p-6 shadow-lg">
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm">User bookings overview and course scheduling.</p>
          </div>

          {/* Section 1: User Bookings Management */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent-500" />
              User Bookings
            </h2>
            
            {/* Error Message */}
            {bookingsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold mr-1">Error!</strong>
                <span className="block sm:inline">{bookingsError}</span>
              </div>
            )}
            
            {/* Loading Indicator */}
            {isLoadingBookings && (
              <div className="flex justify-center items-center py-10">
                <Loader className="w-8 h-8 animate-spin text-accent-600" />
                <span className="ml-2 text-tactical-700">Loading bookings...</span>
              </div>
            )}
            
            {/* Bookings Table */}
            {!isLoadingBookings && !bookingsError && userBookings.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-tactical-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Course Info</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-tactical-700 uppercase">Forms</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-tactical-700 uppercase">Payment</th>
                      <th className="px-2 py-2 text-center text-xs font-medium text-tactical-700 uppercase">Files</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-tactical-900">{booking.firstName} {booking.lastName}</div>
                          <div className="text-sm text-tactical-600">{booking.email}</div>
                          <div className="text-sm text-tactical-600">{booking.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{booking.courseName}</div>
                          <div className="text-sm text-tactical-600">Booked: {formatDate(booking.createdAt)}</div>
                          <div className="text-sm font-medium text-tactical-900">Total: {formatCurrency(booking.totalAmount)}</div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.formsFilled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.formsFilled ? 'Completed' : 'Pending'}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.paymentStatus === 'deposit_paid'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.paymentStatus === 'paid' 
                              ? 'Paid Full' 
                              : booking.paymentStatus === 'deposit_paid'
                              ? 'Deposit Paid'
                              : 'Pending'}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.filesUploaded 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.filesUploaded ? 'Uploaded' : 'Pending'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {booking.filesUploaded && booking.documentPath && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDownloadFile(booking.documentPath || '', `${booking.firstName}_${booking.lastName}_doc.pdf`)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download Files
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* No Bookings Message */}
            {!isLoadingBookings && !bookingsError && userBookings.length === 0 && (
              <div className="text-center py-10 bg-tactical-50 rounded-lg">
                <Users className="w-12 h-12 text-tactical-400 mx-auto mb-4" />
                <h3 className="font-medium text-tactical-800 mb-2">No bookings found</h3>
                <p className="text-tactical-600 mb-6">
                  There are no user bookings in the system yet.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Course Date Scheduling */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4 flex items-center">
              <CalendarPlus className="w-5 h-5 mr-2 text-accent-500" />
              Schedule New Course Date
            </h2>
            {/* Error Message */}
            {scheduleError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold mr-1">Error!</strong>
                <span className="block sm:inline">{scheduleError}</span>
              </div>
            )}
             {/* Success Message */}
            {scheduleSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold mr-1">Success!</strong>
                <span className="block sm:inline">{scheduleSuccess}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Course Dropdown */}
              <div className="md:col-span-2">
                <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Course
                </label>
                <select
                  id="courseSelect"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm rounded-md shadow-sm"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3"
                />
              </div>

              {/* Max Participants */}
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value, 10) || 0)}
                  min="1"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3"
                />
              </div>

              {/* Schedule Button */}
              <div className="md:col-span-5 flex justify-end mt-4">
                 <Button
                    variant="primary"
                    onClick={handleScheduleCourse}
                    disabled={isScheduling}
                    isLoading={isScheduling}
                  >
                   {isScheduling ? 'Scheduling...' : 'Schedule Course Date'}
                 </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;