import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Users, CalendarPlus, Loader, Edit, Trash2, Plus, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';
import { courses as staticCoursesData } from '../../data/courses';
import { supabase } from '../../lib/supabase';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Tables } from '../../../supabase/schema_types';
import { Modal } from '../../components/common/Modal';

type UserProfile = Tables<'users'>;
type CourseDate = Tables<'course_dates'>;
type Course = typeof staticCoursesData[0];

type BookingWithUser = Tables<'bookings'> & {
  users: Pick<Tables<'users'>, 'first_name' | 'last_name' | 'email'> | null;
};

interface CourseDateFormState {
  start_date: string;
  end_date: string;
  max_participants: number;
}

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

  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [courses] = useState<Course[]>(staticCoursesData);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [courseDatesMap, setCourseDatesMap] = useState<Record<string, CourseDate[]>>({});
  const [isLoadingCourseDates, setIsLoadingCourseDates] = useState<Record<string, boolean>>({});
  const [courseDatesError, setCourseDatesError] = useState<Record<string, string | null>>({});

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<CourseDate | null>(null);
  const [currentCourseIdForModal, setCurrentCourseIdForModal] = useState<string | null>(null);
  const [formState, setFormState] = useState<CourseDateFormState>({
    start_date: '',
    end_date: '',
    max_participants: 10,
  });
  const [isSubmittingDate, setIsSubmittingDate] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [isViewParticipantsModalOpen, setIsViewParticipantsModalOpen] = useState(false);
  const [selectedDateForParticipants, setSelectedDateForParticipants] = useState<CourseDate | null>(null);
  const [participants, setParticipants] = useState<BookingWithUser[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [participantsError, setParticipantsError] = useState<string | null>(null);

  // Pagination state
  const [userPage, setUserPage] = useState(0);
  const [bookingPage, setBookingPage] = useState(0);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMoreBookings, setHasMoreBookings] = useState(true);
  const PAGE_SIZE = 10; // Number of records per page

  const fetchUserBookings = useCallback(async (page = 0, reset = false) => {
    setIsLoadingBookings(true);
    setBookingsError(null);
    
    if (!user || !isAuthenticated) {
      setBookingsError("User authentication required");
      setIsLoadingBookings(false);
      return;
    }
    
    try {
      console.log("Fetching bookings (page " + page + ") as user role:", user.role);
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      // Fetch all bookings (RLS should allow admins to see all if configured correctly)
      const { data: bookingsData, error: fetchBookingsError, count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      console.log("Bookings fetch result:", 
        bookingsData?.length || 0, 
        "bookings found", 
        "Error:", fetchBookingsError
      );
      
      if (fetchBookingsError) throw fetchBookingsError;
      
      // Check for RLS limitations if user is admin
      if (user.role === 'admin' && bookingsData && bookingsData.length > 0) {
        const userIds = [...new Set(bookingsData.map(b => b.user_id))];
        console.log("Unique user IDs in fetched bookings:", userIds);
        
        // Check if all bookings are from the current user
        const allFromCurrentUser = bookingsData.every(b => b.user_id === user.id);
        
        // If we're only getting current user's bookings despite being admin,
        // this suggests RLS is limiting access
        if (allFromCurrentUser && userIds.length === 1 && bookingsData.length >= 1) {
          console.warn("RLS appears to be restricting admin access to only their own bookings");
          setBookingsError("Warning: Your admin view is limited to only your bookings due to database permissions. Please contact the system administrator to fix Row Level Security policies for the bookings table.");
        }
      }
      
      // Create a set of unique user IDs from the bookings
      const userIds = [...new Set((bookingsData || []).map(booking => booking.user_id))];
      
      // Then fetch the corresponding users if we have any bookings
      type UserDataMap = { [userId: string]: { id: string; first_name: string; last_name: string; email: string } };
      let userData: UserDataMap = {};
      
      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', userIds);
      
      if (usersError) throw usersError;
      
        // Create a map of user IDs to user data for efficient lookup
        userData = (users || []).reduce<UserDataMap>((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      }
      
      const formattedBookings: UserBooking[] = (bookingsData as any[] || []).map(booking => {
        const course = courses.find(c => c.id === booking.course_id);
        const user = userData[booking.user_id] || null;
        
        return {
          id: booking.id,
          userId: booking.user_id,
          firstName: user?.first_name ?? 'Unknown',
          lastName: user?.last_name ?? 'User',
          email: user?.email ?? 'N/A',
          phone: 'N/A',
          courseId: booking.course_id,
          courseName: course?.title ?? 'Unknown Course',
          totalAmount: booking.total_amount,
          formsFilled: booking.forms_filled ?? false,
          paymentStatus: booking.payment_status as UserBooking['paymentStatus'] || 'pending',
          filesUploaded: booking.files_uploaded ?? false,
          documentPath: booking.document_path,
          createdAt: booking.created_at,
        };
      });
      
      // Set if there are more bookings to load
      setHasMoreBookings(bookingsData.length === PAGE_SIZE);
      
      if (reset) {
      setUserBookings(formattedBookings);
      } else {
        setUserBookings(prev => [...prev, ...formattedBookings]);
      }
      
    } catch (error: any) {
      console.error('Error fetching user bookings:', error);
      setBookingsError(`Failed to load bookings: ${error.message}`);
      setUserBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  }, [courses, user, isAuthenticated]);

  const fetchAllUsers = useCallback(async (page = 0, reset = false) => {
    setIsLoadingUsers(true);
    setUsersError(null);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        if (error.code === '42501') {
          throw new Error('Permission denied. Check RLS policy on the users table for admins.');
        }
        throw error;
      }
      
      // Set if there are more users to load
      setHasMoreUsers(data.length === PAGE_SIZE);
      
      if (reset) {
        setAllUsers((data as UserProfile[]) || []);
      } else {
        setAllUsers(prev => [...prev, ...(data as UserProfile[] || [])]);
      }
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      setUsersError(`Failed to load users: ${error.message}`);
      setAllUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);
  
  const fetchCourseDates = useCallback(async (courseId: string, forceRefresh = false) => {
    if (!forceRefresh && courseDatesMap[courseId]) {
        return;
    }

    setIsLoadingCourseDates(prev => ({ ...prev, [courseId]: true }));
    setCourseDatesError(prev => ({ ...prev, [courseId]: null }));

    try {
      // Limit to 50 dates per course to avoid loading too much data
      const { data, error: fetchError } = await supabase
        .from('course_dates')
        .select(`
          *,
          bookings!bookings_course_date_id_fkey(count)
        `)
        .eq('course_id', courseId)
        .order('start_date', { ascending: true })
        .limit(50);

      if (fetchError) throw fetchError;

      // Update current_participants with the count of bookings
      const processedData = data?.map(date => ({
        ...date,
        current_participants: date.bookings[0]?.count || 0
      })) || [];

      setCourseDatesMap(prev => ({ ...prev, [courseId]: processedData }));
    } catch (err: any) {
      console.error(`Error fetching dates for course ${courseId}:`, err);
      setCourseDatesError(prev => ({ ...prev, [courseId]: `Failed to fetch dates: ${err.message}` }));
      setCourseDatesMap(prev => ({ ...prev, [courseId]: [] }));
    } finally {
      setIsLoadingCourseDates(prev => ({ ...prev, [courseId]: false }));
    }
  }, [courseDatesMap]);

  // Load first page on initial load
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      console.log("Admin user authenticated:", user);
      // Check RLS policies for bookings table
      checkRLSPolicies();
      fetchUserBookings(0, true);
      fetchAllUsers(0, true);
    }
  }, [isAuthenticated, user, fetchUserBookings, fetchAllUsers]);

  // Helper function to check RLS policies
  const checkRLSPolicies = async () => {
    try {
      console.log("Current user ID:", user?.id);
      
      // Test query for all bookings
      const { data: allBookings, error: allError } = await supabase
        .from('bookings')
        .select('id, user_id')
        .limit(100);
      
      console.log("All bookings test:", allBookings?.length || 0, "bookings found", allError);
      
      if (allBookings && allBookings.length > 0) {
        // Find a booking from a different user
        const otherUserBooking = allBookings.find(b => b.user_id !== user?.id);
        
        if (otherUserBooking) {
          console.log("Found booking from other user:", otherUserBooking);
          
          // Try to fetch just that user's bookings as a test
          const { data: specificUserBookings, error: specificError } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', otherUserBooking.user_id)
            .limit(5);
          
          console.log("Other user's bookings test:", 
            specificUserBookings?.length || 0, 
            "bookings found for user", 
            otherUserBooking.user_id, 
            specificError
          );
        } else {
          console.log("All bookings appear to be from the current user", user?.id);
        }
      }
    } catch (err) {
      console.error("Error checking policies:", err);
    }
  };

  // Load more users handler
  const loadMoreUsers = () => {
    if (!isLoadingUsers && hasMoreUsers) {
      const nextPage = userPage + 1;
      setUserPage(nextPage);
      fetchAllUsers(nextPage);
    }
  };

  // Load more bookings handler
  const loadMoreBookings = () => {
    if (!isLoadingBookings && hasMoreBookings) {
      const nextPage = bookingPage + 1;
      setBookingPage(nextPage);
      fetchUserBookings(nextPage);
    }
  };

  // Memoize course data to prevent unnecessary re-renders
  const coursesData = useMemo(() => {
    return courses.map((course) => {
      const isExpanded = expandedCourseId === course.id;
      const datesForCourse = courseDatesMap[course.id] || [];
      const isLoadingDates = isLoadingCourseDates[course.id] || false;
      const errorLoadingDates = courseDatesError[course.id] || null;
      
      return {
        course,
        isExpanded,
        datesForCourse,
        isLoadingDates,
        errorLoadingDates
      };
    });
  }, [courses, expandedCourseId, courseDatesMap, isLoadingCourseDates, courseDatesError]);

  const toggleCourseDates = (courseId: string) => {
    const newExpandedId = expandedCourseId === courseId ? null : courseId;
    setExpandedCourseId(newExpandedId);
    if (newExpandedId) {
        fetchCourseDates(newExpandedId);
    }
  };

  const openAddModal = (courseId: string) => {
      setCurrentCourseIdForModal(courseId);
      setEditingDate(null);
      setFormState({ start_date: '', end_date: '', max_participants: 10 });
      setFormError(null);
      setIsAddEditModalOpen(true);
  };

  const openEditModal = (date: CourseDate) => {
      setCurrentCourseIdForModal(date.course_id);
      setEditingDate(date);
      const formatForInput = (dateStr: string) => {
          try {
              return format(new Date(dateStr), "yyyy-MM-dd'T'HH:mm");
          } catch { return ''; }
      };
      setFormState({
          start_date: formatForInput(date.start_date),
          end_date: formatForInput(date.end_date),
          max_participants: date.max_participants,
      });
      setFormError(null);
      setIsAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
      setIsAddEditModalOpen(false);
      setEditingDate(null);
      setCurrentCourseIdForModal(null);
      setFormError(null);
  };

  const openViewParticipantsModal = async (date: CourseDate) => {
      setSelectedDateForParticipants(date);
      setIsViewParticipantsModalOpen(true);
      setIsLoadingParticipants(true);
      setParticipantsError(null);
      setParticipants([]);
      try {
          // First fetch bookings for this date
          const { data: bookingsData, error: bookingsError } = await supabase
              .from('bookings')
              .select('*')
              .eq('course_date_id', date.id);

          if (bookingsError) throw bookingsError;
          
          if (!bookingsData || bookingsData.length === 0) {
              setParticipants([]);
              setIsLoadingParticipants(false);
              return;
          }
          
          // Extract user IDs from bookings
          const userIds = [...new Set(bookingsData.map(booking => booking.user_id))];
          
          // Then fetch user information
          const { data: usersData, error: usersError } = await supabase
              .from('users')
              .select('id, first_name, last_name, email')
              .in('id', userIds);
              
          if (usersError) throw usersError;
          
          // Create a map of user IDs to user data
          type UserMap = { [userId: string]: { id: string; first_name: string; last_name: string; email: string } };
          const userMap = (usersData || []).reduce<UserMap>((acc, user) => {
              acc[user.id] = user;
              return acc;
          }, {});
          
          // Combine booking and user data
          const participantsWithUsers = bookingsData.map(booking => {
              const user = userMap[booking.user_id] || null;
              return {
                  ...booking,
                  users: user ? {
                      first_name: user.first_name,
                      last_name: user.last_name,
                      email: user.email
                  } : null
              };
          });
          
          setParticipants(participantsWithUsers as BookingWithUser[]);
      } catch (err: any) {
          console.error('Error fetching participants:', err);
          setParticipantsError(`Failed to fetch participants: ${err.message}`);
      } finally {
          setIsLoadingParticipants(false);
      }
  };

  const closeViewParticipantsModal = () => {
      setIsViewParticipantsModalOpen(false);
      setSelectedDateForParticipants(null);
      setParticipants([]);
      setParticipantsError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: name === 'max_participants' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentCourseIdForModal) {
          setFormError("Cannot save date: Course context is missing.");
          return;
      }
      if (!formState.start_date || !formState.end_date || formState.max_participants <= 0) {
          setFormError("Please provide valid start date, end date, and max participants (> 0).");
          return;
      }

      setIsSubmittingDate(true);
      setFormError(null);

      try {
          const startDateIso = new Date(formState.start_date).toISOString();
          const endDateIso = new Date(formState.end_date).toISOString();

          if (editingDate) {
              const { error: updateError } = await supabase
                  .from('course_dates')
                  .update({
                      start_date: startDateIso,
                      end_date: endDateIso,
                      max_participants: formState.max_participants,
                  })
                  .eq('id', editingDate.id)
                  .eq('course_id', currentCourseIdForModal);

              if (updateError) throw updateError;
          } else {
              const { error: insertError } = await supabase
                  .from('course_dates')
                  .insert({
                      course_id: currentCourseIdForModal,
                      start_date: startDateIso,
                      end_date: endDateIso,
                      max_participants: formState.max_participants,
                  });
               if (insertError) throw insertError;
          }
          closeAddEditModal();
          fetchCourseDates(currentCourseIdForModal, true);
      } catch (err: any) {
           console.error('Error saving course date:', err);
           setFormError(`Failed to save date: ${err.message}`);
      } finally {
          setIsSubmittingDate(false);
      }
  };

  const handleDeleteDate = async (date: CourseDate) => {
      const { id: dateId, course_id: courseId, current_participants } = date;
      
      if (current_participants > 0) {
          const warningMsg = `Warning: ${current_participants} user(s) are booked for this date slot. You cannot delete this date until all bookings are removed or reassigned. Would you like to view the participants?`;
          
          if (!window.confirm(warningMsg)) {
              return;
          }
          
          // Instead of trying to delete, open the participants modal to show who is booked
          openViewParticipantsModal(date);
          return;
      } else {
          const confirmMsg = 'Are you sure you want to delete this date slot?';
          if (!window.confirm(confirmMsg)) {
              return;
          }
      }

      try {
           const { error: deleteError } = await supabase
               .from('course_dates')
               .delete()
               .eq('id', dateId);

           if (deleteError) throw deleteError;

           fetchCourseDates(courseId, true);

      } catch (err: any) {
            console.error('Error deleting date:', err);
            
            // Check if it's a foreign key constraint violation
            if (err.message && err.message.includes("violates foreign key constraint")) {
                setCourseDatesError(prev => ({ 
                    ...prev, 
                    [courseId]: `This date has bookings associated with it. You must handle these bookings before deleting the date.` 
                }));
            } else {
                setCourseDatesError(prev => ({ 
                    ...prev, 
                    [courseId]: `Failed to delete date: ${err.message}` 
                }));
            }
      }
  };

  const handleDownloadFile = async (documentPath: string, fileName: string) => {
    try {
      if (!documentPath) {
        alert('No document available for download');
        return;
      }
      
      // Create a signed URL instead of attempting a direct download
      const { data, error } = await supabase.storage
        .from('docs')
        .createSignedUrl(documentPath, 60); // URL valid for 60 seconds
      
      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }
      
      if (!data?.signedUrl) {
        throw new Error('Failed to create download URL');
      }
      
      // Open the signed URL in a new tab, which will trigger the download
      window.open(data.signedUrl, '_blank');
      
    } catch (error: any) {
      console.error('Download error:', error);
      alert(`Failed to download: ${error.message}`);
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

          <div className="bg-tactical-900 text-white rounded-xl p-6 shadow-lg">
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm">User management, bookings overview, and course scheduling.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-accent-500" />
              Manage Courses & Dates
            </h2>
            <div className="space-y-4">
                {coursesData.map(({ course, isExpanded, datesForCourse, isLoadingDates, errorLoadingDates }) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleCourseDates(course.id)}
                            className="w-full flex justify-between items-center p-4 bg-tactical-50 hover:bg-tactical-100 transition-colors"
                            aria-expanded={isExpanded}
                        >
                            <h3 className="font-medium text-lg text-tactical-900">{course.title}</h3>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-tactical-600" /> : <ChevronDown className="w-5 h-5 text-tactical-600" />}
                        </button>

                        {isExpanded && (
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex justify-end mb-4">
                                    <Button onClick={() => openAddModal(course.id)} variant="primary" size="sm">
                                        <Plus className="w-4 h-4 mr-1" /> Add Date for {course.title}
                                    </Button>
                                </div>

                                {errorLoadingDates && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <strong className="font-bold mr-1">Error!</strong> {errorLoadingDates}
                                    </div>
                                )}
                                {isLoadingDates && (
                                    <div className="flex justify-center items-center py-6">
                                        <Loader className="w-6 h-6 animate-spin text-accent-600" />
                                        <span className="ml-2 text-tactical-700">Loading dates...</span>
                                    </div>
                                )}
                                {!isLoadingDates && !errorLoadingDates && (
                                    datesForCourse.length === 0 ? (
                                        <p className="text-center text-tactical-500 py-4">No dates scheduled for this course yet.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                <thead className="bg-gray-50">
                                                     <tr>
                                                        <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Start</th>
                                                        <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase">End</th>
                                                        <th scope="col" className="px-2 py-2 text-center font-medium text-gray-500 uppercase">Slots</th>
                                                        <th scope="col" className="px-4 py-2 text-right font-medium text-gray-500 uppercase">Actions</th>
                                                     </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {datesForCourse.map((date) => (
                                                        <tr key={date.id}>
                                                            <td className="px-4 py-2 whitespace-nowrap">{format(new Date(date.start_date), 'MMM d, yy HH:mm')}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap">{format(new Date(date.end_date), 'MMM d, yy HH:mm')}</td>
                                                            <td className="px-2 py-2 text-center whitespace-nowrap">{date.current_participants}/{date.max_participants}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-right space-x-1">
                                                                <Button variant="outline" size="sm" onClick={() => openViewParticipantsModal(date)} title="View Participants"> <Users className="w-4 h-4" /> </Button>
                                                                <Button variant="outline" size="sm" onClick={() => openEditModal(date)} title="Edit Date"> <Edit className="w-4 h-4" /> </Button>
                                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteDate(date)} className="text-red-600 hover:text-red-800 hover:bg-red-100" title="Delete Date"> <Trash2 className="w-4 h-4" /> </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-accent-500" />
              Registered Users
            </h2>

            {usersError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold mr-1">Error!</strong>
                <span className="block sm:inline">{usersError}</span>
              </div>
            )}

            {isLoadingUsers && (
              <div className="flex justify-center items-center py-10">
                <Loader className="w-8 h-8 animate-spin text-accent-600" />
                <span className="ml-2 text-tactical-700">Loading users...</span>
              </div>
            )}

            {!isLoadingUsers && !usersError && allUsers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-tactical-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Signed Up</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsers.map((usr) => (
                      <tr key={usr.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-tactical-900">{usr.first_name || ''} {usr.last_name || ''}</div>
                          <div className="text-sm text-tactical-600">ID: {usr.id}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                           <div className="text-sm text-tactical-700">{usr.email || 'N/A'}</div>
                        </td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                usr.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                           }`}>
                             {usr.role || 'user'}
                           </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-tactical-600">
                            {formatDate(usr.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {hasMoreUsers && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadMoreUsers}
                      disabled={isLoadingUsers}
                    >
                      {isLoadingUsers ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Users'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

             {!isLoadingUsers && !usersError && allUsers.length === 0 && (
              <div className="text-center py-10 bg-tactical-50 rounded-lg">
                <Users className="w-12 h-12 text-tactical-400 mx-auto mb-4" />
                <h3 className="font-medium text-tactical-800 mb-2">No registered users found</h3>
                <p className="text-tactical-600 mb-6">
                  There are currently no users registered in the system.
                </p>
              </div>
             )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-heading text-xl font-bold text-tactical-900 mb-4 flex items-center">
              <CalendarPlus className="w-5 h-5 mr-2 text-accent-500" />
              User Bookings
            </h2>
            
            {bookingsError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold mr-1">Error!</strong>
                <span className="block sm:inline">{bookingsError}</span>
              </div>
            )}
            
            {isLoadingBookings && (
              <div className="flex justify-center items-center py-10">
                <Loader className="w-8 h-8 animate-spin text-accent-600" />
                <span className="ml-2 text-tactical-700">Loading bookings...</span>
              </div>
            )}
            
            {!isLoadingBookings && !bookingsError && userBookings.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-tactical-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-tactical-700 uppercase">Course / Booking Details</th>
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
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{booking.courseName}</div>
                          <div className="text-sm text-tactical-600">Booked: {formatDate(booking.createdAt)}</div>
                          <div className="text-sm font-medium text-tactical-900">Total: {formatCurrency(booking.totalAmount)}</div>
                          <div className="text-sm text-tactical-500 mt-1">Booking ID: {booking.id}</div>
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
                
                {hasMoreBookings && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadMoreBookings}
                      disabled={isLoadingBookings}
                    >
                      {isLoadingBookings ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Bookings'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {!isLoadingBookings && !bookingsError && userBookings.length === 0 && (
              <div className="text-center py-10 bg-tactical-50 rounded-lg">
                <CalendarPlus className="w-12 h-12 text-tactical-400 mx-auto mb-4" />
                <h3 className="font-medium text-tactical-800 mb-2">No bookings found</h3>
                <p className="text-tactical-600 mb-6">
                  There are no user bookings in the system yet.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />

      <Modal isOpen={isAddEditModalOpen} onClose={closeAddEditModal} title={editingDate ? 'Edit Course Date' : 'Add New Course Date'}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                   <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm" role="alert">
                       {formError}
              </div>
            )}
              {currentCourseIdForModal && (
                <p className="text-sm text-gray-600">
                  Course: <span className="font-medium">{courses.find(c => c.id === currentCourseIdForModal)?.title || 'Unknown'}</span>
                </p>
              )}
              <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <input
                      type="datetime-local" id="start_date" name="start_date"
                      value={formState.start_date} onChange={handleFormChange} required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3 bg-white text-tactical-900"
                />
              </div>
              <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                <input
                      type="datetime-local" id="end_date" name="end_date"
                      value={formState.end_date} onChange={handleFormChange} required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3 bg-white text-tactical-900"
                />
              </div>
              <div>
                  <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input
                      type="number" id="max_participants" name="max_participants"
                      value={formState.max_participants} onChange={handleFormChange} required min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm py-2 px-3 bg-white text-tactical-900"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3">
                   <Button type="button" variant="outline" onClick={closeAddEditModal} disabled={isSubmittingDate}> Cancel </Button>
                   <Button type="submit" variant="primary" isLoading={isSubmittingDate} disabled={isSubmittingDate}>
                      {isSubmittingDate ? 'Saving...' : (editingDate ? 'Update Date' : 'Add Date')}
                 </Button>
              </div>
          </form>
      </Modal>

       <Modal
          isOpen={isViewParticipantsModalOpen}
          onClose={closeViewParticipantsModal}
          title={`Participants for ${selectedDateForParticipants ? format(new Date(selectedDateForParticipants.start_date), 'MMM d, yyyy') : 'Date'}`}
       >
           <div className="mt-4 min-h-[200px] bg-white text-tactical-900 rounded-md p-4">
              {participantsError && (
                   <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mb-4" role="alert">
                       <strong className="font-bold mr-1">Error!</strong> {participantsError}
                   </div>
              )}
              {isLoadingParticipants && (
                  <div className="flex justify-center items-center py-10">
                      <Loader className="w-8 h-8 animate-spin text-accent-600" />
                      <span className="ml-2 text-tactical-700">Loading participants...</span>
                   </div>
              )}
               {!isLoadingParticipants && !participantsError && (
                  participants.length === 0 ? (
                       <p className="text-center text-tactical-500 py-10">No participants booked for this date slot yet.</p>
                  ) : (
                      <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto bg-white rounded-md">
                          {participants.map(booking => (
                              <li key={booking.id} className="py-3 px-3 bg-white hover:bg-tactical-50 transition-colors">
                                  <p className="text-sm font-medium text-tactical-900">
                                       {booking.users?.first_name || 'N/A'} {booking.users?.last_name || ''}
                                   </p>
                                   <p className="text-sm text-tactical-600">{booking.users?.email || 'No email'}</p>
                                   <p className="text-xs text-tactical-500 mt-1">Booking ID: {booking.id} | Status: {booking.payment_status}</p>
                              </li>
                          ))}
                      </ul>
                  )
              )}
              <div className="mt-6 text-right">
                  <Button variant="outline" onClick={closeViewParticipantsModal}>Close</Button>
            </div>
          </div>
      </Modal>

    </>
  );
};

export default AdminDashboard;